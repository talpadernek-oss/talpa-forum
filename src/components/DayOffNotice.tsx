/** "Boş Gün" reminder, shown next to the registration form and on its success screen. */
export default function DayOffNotice({ className = '' }: { className?: string }) {
  return (
    <div className={`rounded-2xl border-l-4 border-forum-sunset bg-white p-6 text-left shadow-sm ring-1 ring-slate-200 ${className}`}>
      <p className="text-lg font-bold text-forum-navy">Değerli Katılımcılarımız,</p>
      <p className="mt-3 text-[17px] leading-relaxed text-slate-700">
        Bu sene 1-2 Aralık’ta düzenlenecek TALPA Uçuş Emniyet Forumu için ilgili şirket departmanlarınızdan{' '}
        <strong className="text-forum-navy">‘Boş Gün’</strong> talep etmeyi unutmayınız.
      </p>
    </div>
  );
}
