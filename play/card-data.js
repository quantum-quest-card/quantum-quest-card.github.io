// Visually verified print originals received 2026-10-16, plus four cost-1 logical qubits.
// Only print trim extraction and orientation; summaries/questions are prototype writing.
export const CARDS=[
 {
  "id": "ftqc",
  "cat": "blue",
  "name": "誤り耐性型量子コンピュータ（FTQC）",
  "en": "FTQC",
  "cost": 6,
  "dice": [
   5,
   9,
   11
  ],
  "yields": {
   "yellow": 1,
   "green": 1
  },
  "desc": "誤り訂正を組み込み、長い量子計算を可能にすることを目指す。",
  "question": "計算能力が大きく伸びたとき、その恩恵は誰に届く？",
  "verified": true,
  "art": "ftqc.png",
  "source": "blue1_FTQC.png",
  "artworkVersion": "print-2026-10-16"
 },
 {
  "id": "network",
  "cat": "blue",
  "name": "量子インターネット",
  "en": "QUANTUM INTERNET",
  "cost": 5,
  "dice": [
   6,
   10
  ],
  "yields": {
   "blue": 1,
   "yellow": 1
  },
  "desc": "量子的な情報をやりとりするネットワークを構想する。",
  "question": "国や組織を越えて接続するとき、誰がルールを決める？",
  "verified": true,
  "art": "network.png",
  "source": "blue2_quantum_internet.png",
  "artworkVersion": "print-2026-10-16"
 },
 {
  "id": "algorithm",
  "cat": "blue",
  "name": "量子アルゴリズムライブラリ",
  "en": "ALGORITHM LIBRARY",
  "cost": 4,
  "dice": [
   8,
   12
  ],
  "yields": {
   "blue": 1,
   "green": 1
  },
  "desc": "量子計算の手順を集め、研究や開発に役立てる仕組み。",
  "question": "知識の共有と、競争での優位をどう両立する？",
  "verified": true,
  "art": "algorithm.png",
  "source": "blue3_q_algorithm_library.png",
  "artworkVersion": "print-2026-10-16"
 },
 {
  "id": "cloud",
  "cat": "blue",
  "name": "量子クラウドサービス",
  "en": "QUANTUM CLOUD SERVICE",
  "cost": 3,
  "dice": [
   4,
   12
  ],
  "yields": {
   "blue": 1,
   "red": 1
  },
  "desc": "離れた場所から量子コンピュータを利用するためのサービス。",
  "question": "利用できる人と、利用しにくい人を分けるのは何？",
  "verified": true,
  "art": "cloud.png",
  "source": "blue4_quantum_cloud_service.png",
  "artworkVersion": "print-2026-10-16"
 },
 {
  "id": "nisq",
  "cat": "blue",
  "name": "ノイズあり中規模量子デバイス（NISQ）",
  "en": "NISQ",
  "cost": 2,
  "dice": [
   3
  ],
  "yields": {
   "wild": 1
  },
  "desc": "ノイズのある量子デバイスで、量子計算の可能性と限界を探る。",
  "question": "新しい技術が登場したとき、それまでの研究経験をどう生かす？",
  "verified": true,
  "art": "nisq.png",
  "source": "blue5_NISQ.png",
  "artworkVersion": "print-2026-10-16"
 },
 {
  "id": "logical-superconducting",
  "cat": "blue",
  "name": "論理量子ビット（超伝導）",
  "en": "LOGICAL QUBIT / SUPERCONDUCTING",
  "cost": 1,
  "dice": [
   2
  ],
  "yields": {
   "blue": 1
  },
  "desc": "人工原子を冷却し、誤り訂正でもつれを守る論理量子ビット。",
  "question": "冷却設備を必要とする技術を、どこで、誰が支える？",
  "verified": true,
  "art": "logical-superconducting.png",
  "source": "Quantum_Quest_blue_logical_qubit_sc_cost1(1).ai"
 },
 {
  "id": "pqc",
  "cat": "red",
  "name": "耐量子暗号（PQC）",
  "en": "PQC",
  "cost": 6,
  "dice": [
   3,
   5,
   9
  ],
  "yields": {
   "yellow": 1,
   "blue": 1
  },
  "desc": "量子コンピュータによる攻撃にも耐えられる暗号方式を目指す。",
  "question": "将来のリスクに備える費用を、いま誰が負担する？",
  "verified": true,
  "art": "pqc.png",
  "source": "red1_PQC.png",
  "artworkVersion": "print-2026-10-16"
 },
 {
  "id": "blockchain",
  "cat": "red",
  "name": "量子耐性ブロックチェーン",
  "en": "QUANTUM-RESISTANT BLOCKCHAIN",
  "cost": 5,
  "dice": [
   3,
   4,
   10
  ],
  "yields": {
   "red": 1,
   "green": 1
  },
  "desc": "量子計算による脅威への備えを、取引記録を共有する仕組みに組み込む。",
  "question": "安全性を高めるための移行を、誰が決め、誰が支える？",
  "verified": true,
  "art": "blockchain.png",
  "source": "red2_q_resistant_blockchain.png",
  "artworkVersion": "print-2026-10-16"
 },
 {
  "id": "diplomacy",
  "cat": "red",
  "name": "量子外交官",
  "en": "QUANTUM DIPLOMATS",
  "cost": 4,
  "dice": [
   6,
   12
  ],
  "yields": {
   "red": 1,
   "yellow": 1
  },
  "desc": "量子技術をめぐる国際的な交渉や連携を支える人材。",
  "question": "技術をめぐって競う相手と、どこまで協力できる？",
  "verified": true,
  "art": "diplomacy.png",
  "source": "red3_quantum_diplomats.png",
  "artworkVersion": "print-2026-10-16"
 },
 {
  "id": "random",
  "cat": "red",
  "name": "量子乱数発生器",
  "en": "QUANTUM RANDOM NUMBER GENERATOR",
  "cost": 3,
  "dice": [
   2,
   4
  ],
  "yields": {
   "red": 1,
   "blue": 1
  },
  "desc": "量子的な現象を利用して、予測しにくい乱数をつくる。",
  "question": "安全という説明を、利用者はどのように確かめる？",
  "verified": true,
  "art": "random.png",
  "source": "red4_quantum_RNG.png",
  "artworkVersion": "print-2026-10-16"
 },
 {
  "id": "qkd",
  "cat": "red",
  "name": "量子鍵配送ネットワーク（QKD）",
  "en": "QKD",
  "cost": 2,
  "dice": [
   2,
   12
  ],
  "yields": {
   "wild": 1
  },
  "desc": "量子の性質を使って、暗号通信の鍵を共有する。",
  "question": "通信の安全性には、技術以外にどんな備えが必要？",
  "verified": true,
  "art": "qkd.png",
  "source": "red5_QKD.png",
  "artworkVersion": "print-2026-10-16"
 },
 {
  "id": "logical-ion-trap",
  "cat": "red",
  "name": "論理量子ビット（イオントラップ）",
  "en": "LOGICAL QUBIT / ION TRAP",
  "cost": 1,
  "dice": [
   2
  ],
  "yields": {
   "red": 1
  },
  "desc": "電場で捕らえたイオンを操り、誤り訂正で支える論理量子ビット。",
  "question": "高い精度を社会で役立てるには、どんな人材や設備が必要？",
  "verified": true,
  "art": "logical-ion-trap.png",
  "source": "Quantum_Quest_red_logical_qubit_iontrap_cost1(1).ai"
 },
 {
  "id": "standard",
  "cat": "green",
  "name": "量子標準",
  "en": "QUANTUM STANDARDS",
  "cost": 6,
  "dice": [
   6,
   8
  ],
  "yields": {
   "yellow": 1,
   "red": 1
  },
  "desc": "技術を評価し、つなぐための共通の基準を考える。",
  "question": "標準をつくる場に、参加できていないのは誰？",
  "verified": true,
  "art": "standard.png",
  "source": "green1_quantum_standards.png",
  "artworkVersion": "print-2026-10-16"
 },
 {
  "id": "risk",
  "cat": "green",
  "name": "量子リスクアセスメント",
  "en": "QUANTUM RISK ASSESSMENT",
  "cost": 5,
  "dice": [
   4,
   8
  ],
  "yields": {
   "green": 1,
   "blue": 1
  },
  "desc": "量子技術がもたらすリスクを検討し、変化への対応を準備する。",
  "question": "何をリスクと捉えるかを決める議論に、誰が参加する？",
  "verified": true,
  "art": "risk.png",
  "source": "green2_q_risk_assessment.png",
  "artworkVersion": "print-2026-10-16"
 },
 {
  "id": "qgc",
  "cat": "green",
  "name": "量子ガバナンス評議会",
  "en": "QUANTUM GOVERNANCE COUNCIL",
  "cost": 4,
  "dice": [
   3,
   9
  ],
  "yields": {
   "green": 1,
   "red": 1
  },
  "desc": "量子技術の社会的な影響や、共有するルールを議論する。",
  "question": "技術の発展を方向づける権限は、誰が持つべき？",
  "verified": true,
  "art": "qgc.png",
  "source": "green3_q_governance_council.png",
  "artworkVersion": "print-2026-10-16"
 },
 {
  "id": "ip",
  "cat": "green",
  "name": "量子知的財産権",
  "en": "QUANTUM INTELLECTUAL PROPERTY",
  "cost": 3,
  "dice": [
   5
  ],
  "yields": {
   "green": 1,
   "yellow": 1
  },
  "desc": "研究開発の成果を保護し、その利用の条件を定める制度。",
  "question": "開発の見返りと、知識や技術へのアクセスをどう両立する？",
  "verified": true,
  "art": "ip.png",
  "source": "green4_quantum_IP.png",
  "artworkVersion": "print-2026-10-16"
 },
 {
  "id": "rights",
  "cat": "green",
  "name": "量子人権委員",
  "en": "QUANTUM HUMAN RIGHTS COMMISSIONER",
  "cost": 2,
  "dice": [
   11
  ],
  "yields": {
   "wild": 1
  },
  "desc": "技術の発展を、人権と公正の観点から問い直す役割。",
  "question": "技術の恩恵や負担が偏ったとき、誰の声を聞く？",
  "verified": true,
  "art": "rights.png",
  "source": "green5_quantum_HR.png",
  "artworkVersion": "print-2026-10-16"
 },
 {
  "id": "logical-neutral-atom",
  "cat": "green",
  "name": "論理量子ビット（中性原子）",
  "en": "LOGICAL QUBIT / NEUTRAL ATOM",
  "cost": 1,
  "dice": [
   12
  ],
  "yields": {
   "green": 1
  },
  "desc": "光ピンセットで並べた原子のもつれを使う論理量子ビット。",
  "question": "異なる方式の研究を、どのような基準で支援する？",
  "verified": true,
  "art": "logical-neutral-atom.png",
  "source": "Quantum_Quest_green_logical_qubit_na_cost1(1).ai"
 },
 {
  "id": "imaging",
  "cat": "yellow",
  "name": "量子イメージング",
  "en": "QUANTUM IMAGING",
  "cost": 6,
  "dice": [
   2,
   3,
   5,
   11,
   12
  ],
  "yields": {
   "blue": 1,
   "red": 1
  },
  "desc": "量子技術を、より詳しく対象を調べるための手段として探る。",
  "question": "見えることが増えると、どんな新しい責任が生まれる？",
  "verified": true,
  "art": "imaging.png",
  "source": "yellow1_quantum_imaging.png",
  "artworkVersion": "print-2026-10-16"
 },
 {
  "id": "drug",
  "cat": "yellow",
  "name": "量子創薬",
  "en": "QUANTUM DRUG DISCOVERY",
  "cost": 5,
  "dice": [
   2,
   3,
   10,
   11
  ],
  "yields": {
   "yellow": 1,
   "green": 1
  },
  "desc": "量子計算を使って、分子の理解や薬の候補探索を助けることを目指す。",
  "question": "開発の費用と、薬にアクセスできる人の範囲をどう考える？",
  "verified": true,
  "art": "drug.png",
  "source": "yellow2_q_drug_discovery.png",
  "artworkVersion": "print-2026-10-16"
 },
 {
  "id": "biomarker",
  "cat": "yellow",
  "name": "量子バイオマーカー計測",
  "en": "QUANTUM BIOMARKER MEASUREMENT",
  "cost": 4,
  "dice": [
   2,
   3,
   11,
   12
  ],
  "yields": {
   "yellow": 1,
   "blue": 1
  },
  "desc": "量子技術を利用し、健康状態に関わる指標を計測することを目指す。",
  "question": "精細な身体情報を、誰がどのような目的で使えるようにする？",
  "verified": true,
  "art": "biomarker.png",
  "source": "yellow3_q_biomarker.png",
  "artworkVersion": "print-2026-10-16"
 },
 {
  "id": "sensor",
  "cat": "yellow",
  "name": "量子センサ",
  "en": "QUANTUM SENSOR",
  "cost": 3,
  "dice": [
   2,
   11,
   12
  ],
  "yields": {
   "yellow": 1,
   "red": 1
  },
  "desc": "量子の性質を利用し、微弱な信号を捉えることを目指す。",
  "question": "高精度の計測で得られた情報を、誰が管理する？",
  "verified": true,
  "art": "sensor.png",
  "source": "yellow4_quantum_sensor.png",
  "artworkVersion": "print-2026-10-16"
 },
 {
  "id": "dot",
  "cat": "yellow",
  "name": "量子ドット",
  "en": "QUANTUM DOTS",
  "cost": 2,
  "dice": [
   2
  ],
  "yields": {
   "wild": 2
  },
  "desc": "非常に小さな半導体の性質を、計測などの応用につなげる。",
  "question": "技術の新しさと、使う人の必要は一致している？",
  "verified": true,
  "art": "dot.png",
  "source": "yellow5_quantum_dots.png",
  "artworkVersion": "print-2026-10-16"
 },
 {
  "id": "logical-photonic",
  "cat": "yellow",
  "name": "論理量子ビット（光）",
  "en": "LOGICAL QUBIT / PHOTONIC",
  "cost": 1,
  "dice": [
   12
  ],
  "yields": {
   "yellow": 1
  },
  "desc": "光子の干渉ともつれを使い、誤り訂正を備える論理量子ビット。",
  "question": "技術ごとの強みと課題を、利用する人にどう伝える？",
  "verified": true,
  "art": "logical-photonic.png",
  "source": "Quantum_Quest_yellow_logical_qubit_optic_cost1(1).ai"
 }
];
export const DOMINATION_CARDS=[
 {
  "cat": "blue",
  "title": "量子エンジニアリングの独占",
  "art": "domination-blue.png",
  "source": "domination_blue.png",
  "artworkVersion": "print-2026-10-16"
 },
 {
  "cat": "red",
  "title": "量子セキュリティの独占",
  "art": "domination-red.png",
  "source": "domination_red.png",
  "artworkVersion": "print-2026-10-16"
 },
 {
  "cat": "green",
  "title": "量子ガバナンスの独占",
  "art": "domination-green.png",
  "source": "domination_green.png",
  "artworkVersion": "print-2026-10-16"
 },
 {
  "cat": "yellow",
  "title": "量子医療の独占",
  "art": "domination-yellow.png",
  "source": "domination_yellow.png",
  "artworkVersion": "print-2026-10-16"
 }
];
