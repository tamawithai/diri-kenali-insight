import React, { useState, useEffect } from "react";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";
import { Radar } from "react-chartjs-2";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Share, RotateCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import heroImage from "@/assets/hero-illustration.jpg";

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

interface Question {
  D: string;
  I: string;
  S: string;
  C: string;
}

interface Scores {
  D: number;
  I: number;
  S: number;
  C: number;
}

type Section = "landing" | "instructions" | "test" | "results";
type DiscType = "D" | "I" | "S" | "C";

const questions: Question[] = [
  { D: "Berani", I: "Antusias", S: "Penyabar", C: "Akurat" },
  { D: "Tegas", I: "Ramah", S: "Setia", C: "Teliti" },
  { D: "Kompetitif", I: "Optimis", S: "Tenang", C: "Sistematis" },
  { D: "Menentukan", I: "Sosial", S: "Stabil", C: "Hati-hati" },
  { D: "Berkemauan Keras", I: "Percaya", S: "Suportif", C: "Disiplin" },
  { D: "Mandiri", I: "Persuasif", S: "Pendengar yang Baik", C: "Rapi" },
  { D: "Pionir", I: "Menawan", S: "Baik Hati", C: "Perfeksionis" },
  { D: "Langsung", I: "Inspiratif", S: "Dapat Diandalkan", C: "Analitis" },
  { D: "Berinisiatif", I: "Ekspresif", S: "Konsisten", C: "Faktual" },
  { D: "Ambisius", I: "Mudah Bergaul", S: "Santai", C: "Logis" },
  { D: "Dominan", I: "Ceria", S: "Penuh Perhatian", C: "Kritis" },
  { D: "Kuat", I: "Menyenangkan", S: "Teratur", C: "Tepat" },
  { D: "Berorientasi Hasil", I: "Populer", S: "Lembut", C: "Cermat" },
  { D: "Memimpin", I: "Suka Bercerita", S: "Pemaaf", C: "Terperinci" },
  { D: "Tidak Sabaran", I: "Banyak Bicara", S: "Lambat", C: "Kaku" },
  { D: "Keras Kepala", I: "Emosional", S: "Ragu-ragu", C: "Pesimis" },
  { D: "Menuntut", I: "Tidak Teratur", S: "Pasif", C: "Pendiam" },
  { D: "Agresif", I: "Impulsif", S: "Bergantung", C: "Menjaga Jarak" },
  { D: "Cepat", I: "Bersemangat", S: "Menenangkan", C: "Taat Aturan" },
  { D: "Bertanggung Jawab", I: "Menghibur", S: "Harmonis", C: "Waspada" },
  { D: "Menyukai Tantangan", I: "Suka Memuji", S: "Memuaskan", C: "Sopan" },
  { D: "Berani Ambil Risiko", I: "Spontan", S: "Tradisional", C: "Objektif" },
  { D: "Otoritatif", I: "Periang", S: "Baik", C: "Standar Tinggi" },
  { D: "Energik", I: "Lincah", S: "Puas", C: "Sadar" },
];

const personalityContent = {
  D: {
    title: "Dominance (D) yang Tegas",
    description:
      "Anda adalah individu yang didorong oleh hasil dan tantangan. Anda bergerak cepat, mengambil keputusan dengan tegas, dan tidak takut menghadapi masalah secara langsung. Anda menikmati lingkungan yang kompetitif dan suka memegang kendali.",
    strengths: [
      "Berorientasi pada tujuan dan hasil akhir",
      "Pemecah masalah yang efisien",
      "Percaya diri dan mandiri",
      "Mampu mengambil keputusan di bawah tekanan",
    ],
    development: [
      "Belajar untuk lebih sabar dan memperhatikan detail",
      "Meningkatkan kepekaan terhadap perasaan orang lain",
      "Mendelegasikan tugas dan lebih banyak percaya pada tim",
    ],
    communication:
      "Anda berkomunikasi secara langsung, jelas, dan to-the-point. Anda lebih fokus pada 'apa' daripada 'bagaimana'.",
  },
  I: {
    title: "Influence (I) yang Inspiratif",
    description:
      "Anda adalah individu yang antusias, optimis, dan berorientasi pada manusia. Anda suka berkolaborasi, bersosialisasi, dan mampu memotivasi orang lain dengan energi positif Anda. Anda adalah komunikator yang hebat.",
    strengths: [
      "Membangun hubungan dengan cepat",
      "Persuasif dan mampu menginspirasi",
      "Ekspresif dan pandai bercerita",
      "Membawa energi positif dan optimisme",
    ],
    development: [
      "Belajar untuk lebih terorganisir dan fokus pada satu tugas",
      "Menindaklanjuti janji dengan tindakan yang konsisten",
      "Menghadapi konflik secara langsung alih-alih menghindarinya",
    ],
    communication:
      "Anda berkomunikasi dengan hangat, ramah, dan ekspresif. Anda suka berbagi cerita dan ide.",
  },
  S: {
    title: "Steadiness (S) yang Suportif",
    description:
      "Anda adalah individu yang tenang, sabar, dan dapat diandalkan. Anda menghargai stabilitas, keharmonisan, dan hubungan yang tulus. Anda adalah pendengar yang hebat dan anggota tim yang sangat setia.",
    strengths: [
      "Sangat suportif dan seorang pendengar yang baik",
      "Sabar dan metodis dalam bekerja",
      "Dapat diandalkan dan konsisten",
      "Mampu menciptakan lingkungan yang harmonis dan stabil",
    ],
    development: [
      "Lebih terbuka terhadap perubahan yang tak terhindarkan",
      "Belajar untuk lebih tegas dalam menyuarakan kebutuhan pribadi",
      "Meningkatkan kemampuan untuk multitasking saat diperlukan",
    ],
    communication:
      "Anda berkomunikasi dengan tenang, lembut, dan penuh pertimbangan. Anda lebih suka mendengarkan daripada berbicara.",
  },
  C: {
    title: "Conscientiousness (C) yang Teliti",
    description:
      "Anda adalah individu yang akurat, analitis, dan berorientasi pada kualitas. Anda bekerja dengan standar yang tinggi dan menikmati proses yang terstruktur. Anda memastikan semuanya benar dan sesuai dengan prosedur.",
    strengths: [
      "Sangat teliti dan memperhatikan detail",
      "Mampu menganalisis masalah secara mendalam",
      "Disiplin dan terorganisir dengan baik",
      "Menjaga kualitas dan akurasi yang tinggi",
    ],
    development: [
      "Belajar untuk tidak terlalu terjebak dalam perfeksionisme",
      "Lebih fleksibel saat menghadapi perubahan rencana",
      "Melihat gambaran besar selain hanya fokus pada detail",
    ],
    communication:
      "Anda berkomunikasi menggunakan data, fakta, dan logika. Anda bertanya 'mengapa' dan 'bagaimana' untuk memahami sesuatu secara penuh.",
  },
};

const DiscTest: React.FC = () => {
  const [currentSection, setCurrentSection] = useState<Section>("landing");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [scores, setScores] = useState<Scores>({ D: 0, I: 0, S: 0, C: 0 });
  const [selectedMost, setSelectedMost] = useState<DiscType | null>(null);
  const [selectedLeast, setSelectedLeast] = useState<DiscType | null>(null);
  const [primaryType, setPrimaryType] = useState<DiscType>("D");
  const { toast } = useToast();

  const calculatePrimaryType = (finalScores: Scores): DiscType => {
    const entries = Object.entries(finalScores) as [DiscType, number][];
    return entries.reduce((a, b) =>
      finalScores[a[0]] > finalScores[b[0]] ? a : b
    )[0];
  };

  const startTest = () => {
    setCurrentSection("test");
    setCurrentQuestionIndex(0);
    setScores({ D: 0, I: 0, S: 0, C: 0 });
    setSelectedMost(null);
    setSelectedLeast(null);
  };

  const nextQuestion = () => {
    if (selectedMost && selectedLeast) {
      const newScores = { ...scores };
      newScores[selectedMost] += 1;
      newScores[selectedLeast] -= 1;

      setScores(newScores);

      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setSelectedMost(null);
        setSelectedLeast(null);
      } else {
        const finalPrimaryType = calculatePrimaryType(newScores);
        setPrimaryType(finalPrimaryType);
        setCurrentSection("results");
      }
    }
  };

  const shareResults = () => {
    const text = `Saya baru tahu tipe kepribadian saya adalah ${personalityContent[primaryType].title}! Penasaran dengan tipemu? Coba di https://kenali-diri.com/`;
    navigator.clipboard.writeText(text);
    toast({
      title: "Hasil berhasil disalin!",
      description: "Bagikan hasilmu di media sosial",
    });
  };

  const restartTest = () => {
    setCurrentSection("landing");
    setCurrentQuestionIndex(0);
    setScores({ D: 0, I: 0, S: 0, C: 0 });
    setSelectedMost(null);
    setSelectedLeast(null);
  };

  const canProceed =
    selectedMost && selectedLeast && selectedMost !== selectedLeast;

  const chartData = {
    labels: [
      "Dominance (D)",
      "Influence (I)",
      "Steadiness (S)",
      "Conscientiousness (C)",
    ],
    datasets: [
      {
        label: "Skor DISC Anda",
        data: [scores.D + 12, scores.I + 12, scores.S + 12, scores.C + 12],
        backgroundColor: "rgba(224, 122, 95, 0.2)",
        borderColor: "rgba(224, 122, 95, 1)",
        borderWidth: 2,
        pointBackgroundColor: "rgba(224, 122, 95, 1)",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    scales: {
      r: {
        beginAtZero: true,
        max: 24,
        ticks: {
          stepSize: 4,
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  if (currentSection === "landing") {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="max-w-4xl mx-auto text-center">
          <img
            src={heroImage}
            alt="Temukan kepribadian unik Anda"
            className="w-full max-w-2xl mx-auto mb-8 rounded-2xl"
          />
          <h1 className="mb-6 text-foreground">
            Temukan Kekuatan Unik dalam Dirimu
          </h1>
          <p className="mb-8 max-w-2xl mx-auto text-muted-foreground">
            Ikuti tes kepribadian DISC gratis dalam 5 menit untuk memahami gaya
            perilakumu, kekuatan terbesarmu, dan bagaimana caramu berinteraksi
            dengan orang lain secara lebih efektif.
          </p>
          <Button
            onClick={() => setCurrentSection("instructions")}
            className="disc-button text-xl"
          >
            Mulai Tes Sekarang
          </Button>
        </div>
      </div>
    );
  }

  if (currentSection === "instructions") {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <Card className="disc-card max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-center">Petunjuk Pengerjaan</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4 mb-8 text-left text-muted-foreground">
              <li className="flex items-center">
                <span className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold mr-3 flex-shrink-0">
                  1
                </span>
                <span>Anda akan melihat 24 set pertanyaan.</span>
              </li>
              <li className="flex items-center">
                <span className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold mr-3 flex-shrink-0">
                  2
                </span>
                <span>
                  Pilih satu kata yang <strong>Paling Sesuai</strong> dan satu
                  yang <strong>Paling Tidak Sesuai</strong> dengan diri Anda di
                  setiap set.
                </span>
              </li>
              <li className="flex items-center">
                <span className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold mr-3 flex-shrink-0">
                  3
                </span>
                <span>
                  Isilah secara spontan berdasarkan diri Anda yang{" "}
                  <strong>paling alami</strong>.
                </span>
              </li>
              <li className="flex items-center">
                <span className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold mr-3 flex-shrink-0">
                  4
                </span>
                <span>
                  Tidak ada jawaban benar atau salah. Jujurlah pada diri
                  sendiri.
                </span>
              </li>
            </ul>
            <div className="text-center">
              <Button onClick={startTest} className="disc-button">
                Saya Mengerti, Lanjutkan
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (currentSection === "test") {
    const currentQuestion = questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="max-w-3xl mx-auto w-full">
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-muted-foreground">
                Pertanyaan {currentQuestionIndex + 1} dari {questions.length}
              </span>
              <span className="text-sm text-muted-foreground">
                {Math.round(progress)}%
              </span>
            </div>
            <Progress value={progress} className="progress-bar" />
          </div>

          <Card className="disc-card">
            <CardHeader>
              <CardTitle className="text-center">
                Dari kelompok kata di bawah, pilih yang paling menggambarkan
                diri Anda
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="question-table">
                  <thead>
                    <tr className="border-b-2 border-border">
                      <th className="text-left p-4 font-bold">Kata Sifat</th>
                      <th className="text-center p-4 font-bold">
                        Paling Sesuai
                      </th>
                      <th className="text-center p-4 font-bold">
                        Paling Tidak Sesuai
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {(
                      Object.entries(currentQuestion) as [DiscType, string][]
                    ).map(([type, word]) => (
                      <tr key={type}>
                        <td className="p-4 font-medium">{word}</td>
                        <td className="p-4 text-center">
                          <input
                            type="radio"
                            name="most"
                            value={type}
                            checked={selectedMost === type}
                            onChange={(e) =>
                              setSelectedMost(e.target.value as DiscType)
                            }
                            className="radio-button"
                          />
                        </td>
                        <td className="p-4 text-center">
                          <input
                            type="radio"
                            name="least"
                            value={type}
                            checked={selectedLeast === type}
                            onChange={(e) =>
                              setSelectedLeast(e.target.value as DiscType)
                            }
                            className="radio-button"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="text-center mt-8">
                <Button
                  onClick={nextQuestion}
                  disabled={!canProceed}
                  className="disc-button"
                >
                  {currentQuestionIndex === questions.length - 1
                    ? "Lihat Hasil Saya"
                    : "Berikutnya"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (currentSection === "results") {
    const content = personalityContent[primaryType];

    return (
      <div className="min-h-screen p-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="mb-6">Inilah Analisis Kepribadian Anda!</h2>
            <div className="flex items-center justify-center gap-6 mb-8">
              <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center">
                <span className="text-4xl font-bold text-primary-foreground">
                  {primaryType}
                </span>
              </div>
              <div className="text-left">
                <h3 className="text-2xl font-bold">Profil Utama Anda:</h3>
                <p className="text-xl text-primary font-bold">
                  {content.title}
                </p>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <Card className="disc-card">
              <CardHeader>
                <CardTitle>Grafik DISC Anda</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="w-full h-80">
                  <Radar data={chartData} options={chartOptions} />
                </div>
              </CardContent>
            </Card>

            <Card className="disc-card">
              <CardHeader>
                <CardTitle>Ringkasan Skor</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(scores).map(([type, score]) => (
                    <div
                      key={type}
                      className="flex justify-between items-center"
                    >
                      <span className="font-medium">
                        {type} -{" "}
                        {type === "D"
                          ? "Dominance"
                          : type === "I"
                          ? "Influence"
                          : type === "S"
                          ? "Steadiness"
                          : "Conscientiousness"}
                      </span>
                      <span className="font-bold text-primary">
                        {score + 12}/24
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="disc-card mb-8">
            <CardContent className="pt-6">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="description">
                  <AccordionTrigger className="text-left">
                    Deskripsi Umum
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-muted-foreground">
                      {content.description}
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="strengths">
                  <AccordionTrigger className="text-left">
                    Kekuatan Utama
                  </AccordionTrigger>
                  <AccordionContent>
                    <ul className="space-y-2 text-muted-foreground">
                      {content.strengths.map((strength, index) => (
                        <li key={index} className="flex items-start">
                          <span className="w-2 h-2 bg-secondary rounded-full mr-3 mt-2 flex-shrink-0"></span>
                          {strength}
                        </li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="development">
                  <AccordionTrigger className="text-left">
                    Area Pengembangan
                  </AccordionTrigger>
                  <AccordionContent>
                    <ul className="space-y-2 text-muted-foreground">
                      {content.development.map((area, index) => (
                        <li key={index} className="flex items-start">
                          <span className="w-2 h-2 bg-primary rounded-full mr-3 mt-2 flex-shrink-0"></span>
                          {area}
                        </li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="communication">
                  <AccordionTrigger className="text-left">
                    Gaya Komunikasi
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-muted-foreground">
                      {content.communication}
                    </p>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={shareResults}
              className="disc-button flex items-center gap-2"
            >
              <Share size={20} />
              Bagikan Hasilmu
            </Button>
            <Button
              onClick={restartTest}
              variant="outline"
              className="px-8 py-4 rounded-full font-bold flex items-center gap-2"
            >
              <RotateCcw size={20} />
              Ulangi Tes
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default DiscTest;
