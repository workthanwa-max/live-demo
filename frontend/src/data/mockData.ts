export const THAI_USERNAMES = [
  'พี่พร_ขายส่ง', 'Nokky_88', 'แม่ค้าน้องเมย์', 'Aom_Zab', 'สายเปย์_2024',
  'Ploy_Supan', 'Jay_bkk', 'Mook_makeup', 'สาวโรงงาน_อินดี้', 'คุณนายบี',
  'Boss_Nut', 'Kitty_jung', 'Shop_by_Ning', 'Mint_review', 'Ging_Ging',
  'A_team_shop', 'Tuck_1990', 'Pat_lovely', 'Som_O', 'Jane_jira',
  'Mali_Mali', 'Pae_yummy', 'KookKik', 'Noey_fresh', 'Beer_indy',
  'Ice_icy', 'Fah_ใส', 'Nan_nanny', 'Joy_joyful', 'Koi_fish',
  'Bow_vy', 'May_may', 'Ann_annie', 'Pang_pond', 'Mew_mew',
  'Khing_khing', 'Nam_tarn', 'Waan_waan', 'Bua_loy', 'Pla_too',
  'Kung_king', 'Gai_gai', 'Nok_hook', 'Moo_ping', 'Maew_miao',
  'Chang_noi', 'Maa_mha', 'Ling_lom', 'Suea_sing', 'Krating_dang'
];

const CF_COMMENTS = [
  'CF ค่ะ', 'รับ 1 ชิ้นค่ะ', 'F 1 ชิ้นค่ะ', 'รับค่ะ โอนเลย', 'CF ชิ้นนี้ค่ะ',
  'เอาแบบนี้ 1 ค่ะ', 'CF 2 ชิ้นค่ะ', 'สั่งแล้วนะคะ', 'โอนแล้วค่ะ ยอด 350', 'F 1 ชิ้นค่ะ',
  'เอาเซ็ตนี้ 1 เซ็ต', 'CF ค่ะ ขอรหัสด้วย', 'พิมพ์รหัสอะไรคะ', 'จอง 1 ค่ะ', 'รับสีนี้ 1 ค่ะ'
];

const QUESTION_COMMENTS = [
  'มีสีอื่นไหมคะ?', 'ราคาเท่าไหร่คะ?', 'ขนาดเท่าไหร่คะ?', 'ของแท้หรือเปล่าคะ?', 'ส่งฟรีไหมคะ?',
  'มีขนาดใหญ่ไหมคะ?', 'ใช้เวลาส่งกี่วัน?', 'วัสดุเป็นอะไรคะ?', 'มีของแถมไหม?', 'มีรับประกันไหมคะ?',
  'ใช้งานยากไหมคะ?', 'มีเก็บเงินปลายทางไหมคะ?', 'ขนาดโดยละเอียดเท่าไหร่คะ?', 'ทำความสะอาดง่ายไหมคะ?', 'ดูแลรักษายังไงคะ?'
];

const CHAT_COMMENTS = [
  'สวยมากกก', 'รอของมาส่งเลยค่ะ', 'รีวิวหน่อยค่ะ', 'น่าใช้มาก', 'แชร์ให้แล้วนะคะ',
  'แม่ค้าสวยจัง', 'เข้ามารอดูค่ะ', 'เพิ่งเข้ามาค่ะ', 'มาทันไหมคะ?', 'สวัสดีค่ะ',
  'ดีจ้าแม่ค้า', 'ช่วยแชร์แล้วน้า', 'สินค้าดีมากค่ะ สั่งรอบที่ 3 แล้ว', 'ติดตามแล้วค่ะ', 'แจกเลยๆๆ'
];

export const COLORS = [
  '#fe2c55', '#25f4ee', '#00c35a', '#ff9900', '#ff00ff', '#3366ff', 
  '#8a2be2', '#ff4500', '#2e8b57', '#dc143c', '#1e90ff', '#ff1493'
];

export const getRandomComment = (id: number) => {
  const username = THAI_USERNAMES[Math.floor(Math.random() * THAI_USERNAMES.length)];
  const color = COLORS[Math.floor(Math.random() * COLORS.length)];
  
  // Decide what type of comment
  const rand = Math.random();
  let text = '';
  let isPurchased = false;

  if (rand < 0.4) {
    // 40% chance it's a CF/Purchase comment
    text = CF_COMMENTS[Math.floor(Math.random() * CF_COMMENTS.length)];
    isPurchased = true;
  } else if (rand < 0.7) {
    // 30% chance it's a question
    text = QUESTION_COMMENTS[Math.floor(Math.random() * QUESTION_COMMENTS.length)];
  } else {
    // 30% chance it's a general chat
    text = CHAT_COMMENTS[Math.floor(Math.random() * CHAT_COMMENTS.length)];
  }

  const avatarUrl = `https://i.pravatar.cc/150?u=${encodeURIComponent(username)}`;

  return {
    id: `comment-${id}`,
    username,
    text,
    color,
    avatarUrl,
    isPurchased,
  };
};
