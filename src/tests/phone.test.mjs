import test from 'node:test';
import assert from 'node:assert/strict';
import {
  AUTH_PHONE_COUNTRIES,
  detectCountry,
  phoneFromInput,
  nationalPhone,
  formatNationalPhone,
  isValidPhone,
  normalizePhone,
  editPhoneInput,
} from '../components/common/PhoneInput/phone.ts';

test('Russia and Kazakhstan share +7 but are detected by the number', () => {
  for (const phone of ['+77011234567', '+76011234567', '+70011234567']) assert.equal(detectCountry(phone, 'RU'), 'KZ');
  assert.equal(detectCountry('+79991234567', 'KZ'), 'RU');
  assert.equal(detectCountry('87011234567'), 'KZ');
});

test('country prefix appears only in the selector, API receives a full number', () => {
  assert.equal(nationalPhone('+7', 'RU'), '');
  assert.equal(phoneFromInput('9991234567', 'RU'), '+79991234567');
  assert.equal(formatNationalPhone('+79991234567', 'RU'), '(999) 123-45-67');
  assert.equal(phoneFromInput('7771234567', 'KZ'), '+77771234567');
  assert.equal(phoneFromInput('291234567', 'BY'), '+375291234567');
  assert.equal(nationalPhone('+375291234567', 'BY'), '291234567');
  assert.equal(phoneFromInput('', 'BY'), '+375');
});

test('pasting an international or domestic full number keeps a single prefix', () => {
  for (const raw of ['+7 (999) 123-45-67', '79991234567', '8 (999) 123-45-67'])
    assert.equal(phoneFromInput(raw, 'RU'), '+79991234567');
  assert.equal(phoneFromInput('+375 (29) 123-45-67', 'RU'), '+375291234567');
  assert.equal(phoneFromInput('375291234567', 'BY'), '+375291234567');
  assert.equal(normalizePhone('+998901234567', 'RU'), '+998901234567');
});

test('all configured CIS countries are selectable and validate complete numbers', () => {
  const cases = {
    AM: '+37477123456',
    AZ: '+994501234567',
    KG: '+996700123456',
    MD: '+37368123456',
    TJ: '+992901234567',
    TM: '+99365123456',
    UZ: '+998901234567',
  };
  for (const [country, phone] of Object.entries(cases)) {
    assert.ok(AUTH_PHONE_COUNTRIES.includes(country));
    assert.equal(detectCountry(phone), country);
    assert.ok(isValidPhone(phone));
    assert.equal(isValidPhone(phone.slice(0, -1)), false);
  }
  assert.equal(isValidPhone('+7'), false);
  assert.equal(isValidPhone('+3747712345'), false);
});

test('mask is applied on each keystroke without losing the cursor', () => {
  let value = '+7',
    caret = 0;
  const expected = [
    '(9',
    '(96',
    '(962)',
    '(962) 4',
    '(962) 40',
    '(962) 405',
    '(962) 405-0',
    '(962) 405-04',
    '(962) 405-04-9',
    '(962) 405-04-95',
  ];
  for (const [index, digit] of [...'9624050495'].entries()) {
    const before = formatNationalPhone(value, 'RU');
    const edited = editPhoneInput(
      before.slice(0, caret) + digit + before.slice(caret),
      caret + 1,
      'RU',
      before,
      'insertText',
    );
    value = edited.value;
    caret = edited.caret;
    assert.equal(formatNationalPhone(value, 'RU'), expected[index]);
    assert.equal(caret, expected[index].length);
  }
  const back = editPhoneInput('(962) 40504-95', 9, 'RU', '(962) 405-04-95', 'deleteContentBackward');
  assert.equal(back.value, '+7962400495');
  const forward = editPhoneInput('(962) 40504-95', 9, 'RU', '(962) 405-04-95', 'deleteContentForward');
  assert.equal(forward.value, '+7962405495');
  const paste = editPhoneInput('+7 (962) 405-04-95', 18, 'RU', '', 'insertFromPaste');
  assert.equal(paste.value, '+79624050495');
  assert.equal(paste.caret, 15);
});
