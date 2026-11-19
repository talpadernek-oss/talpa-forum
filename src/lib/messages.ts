/** Site languages and the API's user-facing messages in each. */

export type Lang = 'tr' | 'en';

/** Anything other than "en" (missing, unknown) falls back to Turkish. */
export const langOf = (v: unknown): Lang => (v === 'en' ? 'en' : 'tr');

const MESSAGES = {
  nameRequired: { tr: 'Lütfen ad ve soyadı giriniz.', en: 'Please enter your full name.' },
  nameBoth: { tr: 'Lütfen ad ve soyadınızı birlikte giriniz.', en: 'Please enter both your first and last name.' },
  emailInvalid: { tr: 'Geçerli bir e-posta adresi giriniz.', en: 'Please enter a valid e-mail address.' },
  phoneInvalid: {
    tr: 'Geçerli bir telefon numarası giriniz (ör. 0532 123 45 67).',
    en: 'Please enter a valid phone number (e.g. +90 532 123 45 67).'
  },
  jobTitleRequired: { tr: 'Lütfen iş ünvanınızı seçiniz.', en: 'Please select your job title.' },
  organizationRequired: { tr: 'Lütfen çalıştığınız firma / kurumu giriniz.', en: 'Please enter your company / organisation.' },
  daysRequired: { tr: 'Lütfen katılacağınız günü seçiniz.', en: 'Please select the day(s) you will attend.' },
  consentRequired: {
    tr: 'Devam etmek için aydınlatma metnini onaylayınız.',
    en: 'Please accept the personal data notice to continue.'
  },
  tooManyAttempts: {
    tr: 'Çok fazla deneme yapıldı. Lütfen birkaç dakika sonra tekrar deneyiniz.',
    en: 'Too many attempts. Please try again in a few minutes.'
  },
  tcInvalid: { tr: 'Geçerli bir T.C. Kimlik Numarası giriniz.', en: 'Please enter a valid Turkish ID number (T.C. Kimlik No).' },
  notMember: {
    tr: 'Bu T.C. Kimlik Numarası ile aktif bir TALPA üyeliği bulunamadı.',
    en: 'No active TALPA membership was found for this ID number.'
  },
  duplicateEmail: {
    tr: 'Bu e-posta adresiyle kaydınız zaten alınmış. Değişiklik için bizimle iletişime geçebilirsiniz.',
    en: 'A registration with this e-mail address already exists. Please contact us if you need to make any changes.'
  },
  duplicateMember: {
    tr: 'Bu TALPA üyeliğiyle kaydınız zaten alınmış. Değişiklik için bizimle iletişime geçebilirsiniz.',
    en: 'A registration already exists for this TALPA membership. Please contact us if you need to make any changes.'
  },
  registerFailed: {
    tr: 'Kayıt şu anda alınamadı. Lütfen biraz sonra tekrar deneyiniz.',
    en: 'Your registration could not be completed at the moment. Please try again shortly.'
  },
  memberUnavailable: { tr: 'Üyelik doğrulama şu anda kullanılamıyor.', en: 'Membership verification is currently unavailable.' },
  memberUnreachable: {
    tr: 'Üyelik sistemine şu anda ulaşılamıyor. Lütfen biraz sonra tekrar deneyiniz.',
    en: 'The membership system cannot be reached at the moment. Please try again shortly.'
  }
} satisfies Record<string, Record<Lang, string>>;

export type MessageKey = keyof typeof MESSAGES;

export const msg = (key: MessageKey, lang: Lang) => MESSAGES[key][lang];
