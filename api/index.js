// vercel.js   ← ضعه في الـ root أو جوا api/index.js
import '../server.js';   // ده هيشغل الـ server.js القديم كامل (مع كل الـ routes والـ middleware)

export const config = {
  api: {
    bodyParser: false,   // لو عندك upload أو raw body
  },
};

export default function handler(req, res) {
  // Vercel هيستدعي الـ server.js القديم تلقائيًا لما نستورد فوق
  // بس احنا مش محتاجين نعمل حاجة هنا
  // الـ Express app شغال بالفعل من السطر الأول
  return;
}