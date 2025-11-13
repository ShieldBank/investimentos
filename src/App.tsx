/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./components/ui/card";
import { Input } from "./components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./components/ui/table";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "./components/ui/chart";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { Label } from "./components/ui/label";

import SHIELDBANK from "../assets/SHIELDBANK.png";
import Seta from "../assets/avanco-rapido.png";

// import { Button } from "./components/ui/button";
import axios from "axios";

import { toPng } from "html-to-image";
import jsPDF from "jspdf";

// eslint-disable-next-line react-refresh/only-export-components
export async function exportPDF() {
  const input = document.getElementById("relatorio");
  if (!input) return;

  // 🔹 Esconde botões e remove limite de altura
  const scrollable = document.querySelector(".tabela");
  const list = document.querySelectorAll(".tdList");

  const buttons = document.querySelectorAll(".no-pdf, .no-pdfF");
  console.log(scrollable);
  scrollable?.classList.remove("max-h-[580px]");
  list.forEach((el) => el.classList.remove("max-md:text-[0.9rem]"));

  scrollable?.classList.add("h-auto");
  list.forEach((el) => el.classList.add("max-md:text-[0.5rem]"));
  buttons.forEach((el) => el.classList.add("hide-for-pdf"));

  // Aguarda o layout se ajustar
  await new Promise((resolve) => setTimeout(resolve, 300));

  try {
    // const isMobile = window.innerWidth <= 768;

    // 🔹 Captura a tela com alta resolução
    const dataUrl = await toPng(input, {
      cacheBust: true,
      pixelRatio: 3,
      quality: 1,
      useCORS: true, // 👈 importante
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);

    const img = new Image();
    img.src = dataUrl;
    await new Promise((resolve) => (img.onload = resolve));

    // 🔹 Calcula o tamanho do PDF dinamicamente
    const A4_WIDTH = 200;
    const imgWidth = A4_WIDTH;
    const imgHeight = (img.height * imgWidth) / img.width;

    // 🔹 Cria o PDF com altura ajustada ao conteúdo
    const pdf = new jsPDF("p", "mm", [imgHeight, A4_WIDTH]);

    pdf.addImage(img, "PNG", 0, 0, imgWidth, imgHeight);
    pdf.save("relatorio.pdf");
  } catch (err) {
    console.error("Erro ao gerar PDF:", err);
  } finally {
    // 🔹 Restaura layout
    scrollable?.classList.add("max-h-[580px]");
    buttons.forEach((el) => el.classList.remove("hide-for-pdf"));
  }
}

function App() {
  const [CDIAno, setCDIAno] = useState<number>();
  const [inflacao, setInflacao] = useState<number>(0);
  const [periodo, setPeriodo] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number>(0);
  const [aporteInicial, setaporteInicial] = useState<number>(0);
  const [aporteMensal, setaporteMensal] = useState<number>(0);
  // const [indexador, setIndexador] = useState<boolean>(false);
  const values = [
    {
      Ativo: "Shield Bank",
      Indexador: 1.5,
      Taxa_a: 0,
      Taxa_m: 0,
      Rendimento_Período_percentual: 0,
      Rendimento_Período_real: 0,
      Rendimento_Valor_investido: 0,
      Aliquota_de_Imposto: 0,
      Rendimento_Líquido_Imposto: 0,
    },
    {
      Ativo: "CDB Pós Fixado",
      Indexador: 100,
      Taxa_a: 0,
      Taxa_m: 0,
      Rendimento_Período_percentual: 0,
      Rendimento_Período_real: 0,
      Rendimento_Valor_investido: 0,
      Aliquota_de_Imposto: 0,
      Rendimento_Líquido_Imposto: 0,
    },
    {
      Ativo: "Tesouro Pré Fixado",
      Indexador: 12,
      Taxa_a: 0,
      Taxa_m: 0,
      Rendimento_Período_percentual: 0,
      Rendimento_Período_real: 0,
      Rendimento_Valor_investido: 0,
      Aliquota_de_Imposto: 0,
      Rendimento_Líquido_Imposto: 0,
    },
    {
      Ativo: "CRA Inflação",
      Indexador: 6,
      Taxa_a: 0,
      Taxa_m: 0,
      Rendimento_Período_percentual: 0,
      Rendimento_Período_real: 0,
      Rendimento_Valor_investido: 0,
      Aliquota_de_Imposto: 0,
      Rendimento_Líquido_Imposto: 0,
    },
    {
      Ativo: "Poupança",
      Indexador: 0,
      Taxa_a: 0,
      Taxa_m: 0,
      Rendimento_Período_percentual: 0,
      Rendimento_Período_real: 0,
      Rendimento_Valor_investido: 0,
      Aliquota_de_Imposto: 0,
      Rendimento_Líquido_Imposto: 0,
    },
  ];

  const [barSize, setBarSize] = useState<number>();
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setBarSize(25);
      } else {
        setBarSize(50);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const getMonth = new Date().getMonth() + 1;
  const getDay = new Date().getDate();
  const getYear = new Date().getFullYear();

  const getDayFormatted = getDay.toString().padStart(2, "0");
  const getMonthFormatted = getMonth.toString().padStart(2, "0");
  const getYearFormatted = getYear.toString().padStart(2, "0");
  const dateformatted = `${getDayFormatted}/${getMonthFormatted}/${getYearFormatted}`;
  // const dateformattedInitial = `01/${getMonthFormatted}/${getYearFormatted}`;

  const getMonthBancoCentral = new Date()
    .getMonth()
    .toString()
    .padStart(2, "0");

  const dateformattedInitialBancoCentral = `01/${getMonthBancoCentral}/${getYearFormatted}`;
  const dateformattedInflacao = `01/01/${getYearFormatted}`;

  const urlBancoCentral = `https://api.bcb.gov.br/dados/serie/bcdata.sgs.12/dados?formato=json&dataInicial=${dateformattedInitialBancoCentral}&dataFinal=${dateformatted}`;
  const urlBancoCentralInflacao = `https://api.bcb.gov.br/dados/serie/bcdata.sgs.433/dados?formato=json&dataInicial=${dateformattedInflacao}`;

  const dadosCDI = async () => {
    const result = (await axios.get(urlBancoCentral)).data;
    const cdiDay = result[0].valor / 100;
    const cdiAnual = (1 + Number(cdiDay)) ** 252 - 1;
    setCDIAno(cdiAnual * 100);
  };
  useEffect(() => {
    dadosCDI();
  }, []);
  const dados = async () => {
    const result: [
      {
        data: string;
        valor: string;
      }
    ] = (await axios.get(urlBancoCentralInflacao)).data;
    const sizeMonth = result.length;

    const soma = result.reduce(
      (acc, currentValue) => Number(currentValue.valor) + acc,
      0
    );
    const inflacaoAtual = soma;
    const mediaInflacao = soma / sizeMonth;
    const inserindoMediaMesesSubsequentes = mediaInflacao * (12 - sizeMonth);

    const inflacaoMedia = inflacaoAtual + inserindoMediaMesesSubsequentes;

    setInflacao(inflacaoMedia);
  };
  useEffect(() => {
    dados();
  }, []);

  const [rendimentoGrafico, setRendimentoGrafico] = useState(values);

  function formmatedN(n: number) {
    Number(n);
    return new Intl.NumberFormat("pt-BR", {
      style: "percent",
      currency: "BRL",
      minimumFractionDigits: 2,
    }).format(Number(n));
  }

  function formattedReal(n: number) {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 2,
    }).format(n);
  }

  const mesesjurosCompostos = useMemo(() => {
    const meses: number[] = [];
    const mesesTotais =
      getMonth + 1 + (selectedOption === 0 ? periodo : periodo * 12);
    for (let i = getMonth + 1; i < mesesTotais; i++) {
      if (i > 12 && i < 25) {
        meses.push(i - 12);
      } else if (i > 24 && i < 37) {
        meses.push(i - 24);
      } else if (i > 36 && i < 49) {
        meses.push(i - 36);
      } else if (i > 48 && i < 61) {
        meses.push(i - 48);
      } else if (i > 60 && i < 73) {
        meses.push(i - 60);
      } else if (i > 72 && i < 85) {
        meses.push(i - 72);
      } else if (i > 84 && i < 97) {
        meses.push(i - 84);
      } else if (i > 96 && i < 108) {
        meses.push(i - 96);
      } else {
        meses.push(i);
      }
    }

    return meses;
  }, [periodo, selectedOption]);
  let aporteJuros = aporteInicial + aporteMensal;
  const chartConfigDados = {
    Investimentos: {
      label: "Aporte",
      color: "#2563eb",
    },

    Juros: {
      label: "Juros",
      color: "#60a5fa",
    },
  } satisfies ChartConfig;
  const chartConfig = {
    Rendimento_Período_real: {
      label: "Bruto ",
      color: "#2563eb",
    },

    Rendimento_Líquido_Imposto: {
      label: "Líquido ",
      color: "#60a5fa",
    },
  } satisfies ChartConfig;
  const acumuladorJuros: number[] = [];

  const dadosGrafico = [
    {
      id: 0,
      aporte: 0,
      juros: 0,
    },
  ];
  type JurosCompostos = {
    juros: number;
    totalJuros: number;
    totalAcumulado: number;
  };
  const jurosCompostos: JurosCompostos[] = [
    {
      juros: 0,
      totalJuros: 0,
      totalAcumulado: 0,
    },
  ];

  const contentRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <div
        id="relatorio"
        className=" h-full  border-0 p-10 py-30 max-md:py-30 flex justify-center "
        ref={contentRef}
      >
        <div
          id="bloco-a-controlar"
          className="bloco-inteiro w-full max-md:flex max-md:flex-col max-md:justify-center"
        >
          <div className="   w-full flex justify-around gap-2 max-md:flex max-md:flex-col    ">
            <img
              className="w-[38%]  img max-sm:w-full min-lg:-mt-40  max-md:-mt-30"
              src={SHIELDBANK}
            />

            <Card className="bloco-inteiro w-[40%] card    max-md:w-full max-md:mb-10  h-full bg-[#020922] border-0 rounded-2xl p-10 text-[#162456] gap-3">
              <Label htmlFor="aporteInicial" className="text-[#CCAA76] ">
                Aporte Inicial
              </Label>

              <Input
                id="aporteInicial"
                type="text"
                placeholder="aporte inicial"
                className="bg-slate-50"
                value={formattedReal(aporteInicial)}
                onChange={(e) => {
                  const apenasNumeros = e.target.value.replace(/[\D]/g, "");
                  setaporteInicial(Number(apenasNumeros) / 100);
                }}
              />

              <Label htmlFor="aporteMensal" className="text-[#CCAA76]">
                Investimento Mensal
              </Label>

              <Input
                id="aporteMensal"
                type="text"
                placeholder="aporte mensal"
                className="bg-slate-50"
                value={formattedReal(aporteMensal)}
                onChange={(e) => {
                  const apenasNumeros = e.target.value.replace(/[\D]/g, "");

                  setaporteMensal(Number(apenasNumeros) / 100);
                }}
              />
              <Label htmlFor="periodo" className="text-[#CCAA76] ">
                Periodo do Aporte
              </Label>
              <div className="flex  gap-2">
                <Input
                  id="periodo"
                  type=""
                  placeholder="periodo"
                  className="bg-slate-50"
                  onChange={(e) => setPeriodo(Number(e.target.value))}
                />
                <select
                  className="bg-slate-50 w-[5rem] p-1.5 rounded-[0.5rem]"
                  name="periodo"
                  id="periodo"
                  onChange={(e) => {
                    if (e.target.value === "mes") {
                      setSelectedOption(0);
                    } else {
                      setSelectedOption(1);
                    }
                  }}
                >
                  <option value="mes" selected>
                    mes
                  </option>
                  <option value="ano">ano</option>
                </select>
              </div>
              <Label htmlFor="CDI" className="text-[#CCAA76]">
                CDI (ano)
              </Label>

              <Input
                className="bg-transparent text-amber-50 max-md:text-2xl text-2xl disabled:opacity-80"
                id="CDI"
                type="text"
                disabled
                placeholder="CDI (ano)"
                value={formmatedN((CDIAno ?? 1) / 100)}
                onChange={(e) => setCDIAno(Number(e.target.value))}
              />

              <Label htmlFor="inflação" className="text-[#CCAA76]">
                inflação (ano)
              </Label>

              <Input
                className="bg-transparent text-amber-50 max-md:text-2xl text-2xl disabled:opacity-80"
                id="inflação"
                type="text"
                disabled
                placeholder="inflação (ano)"
                value={formmatedN(inflacao / 100)}
                onChange={(e) => setInflacao(Number(e.target.value))}
              />
            </Card>
            <Card className="bloco-inteiro w-[18%] card    h-full  max-md:w-full max-md:mb-10   bg-[#020922] border-amber-50 rounded-3xl p-4 text-amber-50 gap-3">
              <Label className="text-[1.2rem] text-[#CCAA76] m-5">
                Simulação de Taxa
              </Label>
              <Label className="text-amber-50" htmlFor="Taxa Shield">
                <Input
                  className="w-full text-center   text-black bg-amber-50  appearance-none  "
                  id="Taxa Shield "
                  type="number"
                  placeholder="Insira sua taxa shield"
                  //value={rendimentoGrafico[0].Indexador || ""}
                  onChange={(taxa) => {
                    setRendimentoGrafico((state) =>
                      state.map((e, i) =>
                        i === 0
                          ? { ...e, Indexador: Number(taxa.target.value) }
                          : e
                      )
                    );
                  }}
                />
                {/* <p className="text-[1rem]">Taxa Shield Mes</p> */}
              </Label>
              <Label
                htmlFor="a.a"
                className="text-[#CCAA76] flex items-center gap-2"
              >
                <Input
                  className="w-20  text-black bg-amber-50  appearance-none "
                  id="a.a"
                  type="text"
                  placeholder="aporte mensal"
                  value={rendimentoGrafico[1].Indexador || 0}
                  onChange={(a) => {
                    setRendimentoGrafico((state) =>
                      state.map((e, i) =>
                        i === 1
                          ? { ...e, Indexador: Number(a.target.value) }
                          : e
                      )
                    );
                  }}
                />
                <p className="text-[1rem]"> CDB Pós Fixado</p>
              </Label>

              <Label
                htmlFor="a.a"
                className="text-[#CCAA76] flex items-center gap-2"
              >
                <Input
                  className="w-20  text-black bg-amber-50  appearance-none "
                  id="a.a"
                  type="text"
                  placeholder="aporte mensal"
                  value={rendimentoGrafico[2].Indexador || 0}
                  onChange={(a) => {
                    setRendimentoGrafico((state) =>
                      state.map((e, i) =>
                        i === 2
                          ? { ...e, Indexador: Number(a.target.value) }
                          : e
                      )
                    );
                  }}
                />
                <p className="text-[1rem]"> Tesouro Pré Fixado</p>
              </Label>

              <Label
                htmlFor=" + IPCA"
                className="text-[#CCAA76] flex items-center gap-2"
              >
                <Input
                  className="w-20  text-black bg-amber-50  appearance-none "
                  id=" + IPCA"
                  type="text"
                  placeholder="periodo (mês)"
                  value={rendimentoGrafico[3].Indexador || 0}
                  onChange={(ipca) =>
                    setRendimentoGrafico((state) =>
                      state.map((e, i) =>
                        i === 3
                          ? { ...e, Indexador: Number(ipca.target.value) }
                          : e
                      )
                    )
                  }
                />
                <p className="text-[1rem]"> + IPCA</p>
              </Label>
            </Card>
            <div className=" no-pdf flex justify-center">
              <button
                className="cursor-pointer bg-[#020922] text-amber-50 rounded-2xl p-1 max-md:justify-center  max-md:p-4 max-md:w-[10rem] max-md:mb-10 "
                onClick={exportPDF}
              >
                Exporta em PDF
              </button>
            </div>
          </div>

          {rendimentoGrafico[0].Rendimento_Líquido_Imposto > 0 && (
            <div key={selectedOption} className="bloco-inteiro">
              <Card className="w-full  card  no-break   flex  max-md:w-full max-md:mb-10  h-auto mt-5  bg-[#e9e9e9]   border-0 rounded-2xl p-5 text-amber-50">
                <h2 className="text-4xl text-black">Resumo</h2>
                <div className="  w-full flex justify-center max-md:gap-0 gap-20 max-md:flex-col">
                  <Card className="transition-transform duration-300 ease-in-out hover:animate-pulse bg-[#162456] w-full  shadow-2xl max-md:w-full max-md:h-[7rem] max-md:mb-10  max-md:p-1 justify-center items-center max-md:gap-0 h-28 border-0 rounded-2xl p-10  gap-3">
                    <div className="  flex  flex-col gap-2 justify-center items-center">
                      <h1 className="text-3xl max-md:text-2xl   text-amber-50 ">
                        Valor Total
                      </h1>
                      <Label
                        htmlFor="Valor Total"
                        className="text-4xl   max-md:text-3xl text-amber-50 "
                      >
                        {formattedReal(
                          rendimentoGrafico[0].Rendimento_Valor_investido +
                            rendimentoGrafico[0].Rendimento_Período_real
                        )}
                      </Label>
                    </div>
                  </Card>
                  <Card className=" max-md:w-full  w-full shadow-2xl max-md:h-[7rem] max-md:mb-10  max-md:p-1 justify-center items-center max-md:gap-0 h-28 bg-[#e9e9e9] border-0 rounded-2xl p-10 text-amber-50 gap-3">
                    <div className="  flex  flex-col gap-2 justify-center items-center">
                      <h1 className="text-3xl text-blue-950 max-md:text-2xl">
                        Valor Investido
                      </h1>
                      <Label
                        htmlFor="Valor Investido"
                        className="text-4xl  max-md:text-3xl"
                      >
                        {formattedReal(
                          rendimentoGrafico[0].Rendimento_Valor_investido
                        )}
                      </Label>
                    </div>
                  </Card>
                  <Card className=" max-md:w-full  w-full shadow-2xl max-md:h-[7rem] max-md:mb-10  max-md:p-1 justify-center items-center max-md:gap-0 h-28 bg-[#e9e9e9] border-0 rounded-2xl p-10 text-amber-50 gap-3">
                    <div className="  flex  flex-col gap-2 justify-center items-center">
                      <h1 className="text-3xl  text-blue-950 max-md:text-2xl">
                        Rendimento Shield
                      </h1>
                      <Label
                        htmlFor="periodo"
                        className="text-4xl  max-md:text-3xl text-blue-950"
                      >
                        {" "}
                        {formattedReal(
                          rendimentoGrafico[0].Rendimento_Período_real
                        )}
                      </Label>
                    </div>
                  </Card>
                </div>
              </Card>
            </div>
          )}
          <div className="">
            {/* Tabela de Rendimento por mes  */}
            {periodo > 0 && (
              <>
                <div className="  max-w-full  flex flex-col    max-md:gap-0 max-sm:flex max-sm:flex-col place-content-center place-items-center border-0 ">
                  <Card className="tabela  card max-h-[580px] rounded-3xl  border-0   max-sm:max-w-full ">
                    <CardTitle className="text-black text-3xl max-md:text-2xl">
                      Tabela De Rendimentos
                    </CardTitle>
                    <Table className="teste rounded-2xl  bg-slate-50 text-black  max-md:h-[12rem] max-md:text-center  ">
                      <TableHeader className="  bg-gray-900 text-amber-50 ">
                        <TableRow className="">
                          <TableHead className=" tdList   sticky left-0  bg-gray-900 border-gray-400  z-50 w-[80px] max-md:text-[0.9rem]  ">
                            Meses
                          </TableHead>
                          <TableHead className="tdList w-[100px] max-md:text-[0.9rem] ">
                            Juros
                          </TableHead>
                          <TableHead className="tdList w-[100px] max-md:text-[0.9rem]">
                            Total Investido
                          </TableHead>
                          <TableHead className="tdList w-[100px] max-md:text-[0.9rem] ">
                            Total Juros
                          </TableHead>
                          <TableHead className="tdList w-[100px] max-md:text-[0.9rem] ">
                            Total Acumulado
                          </TableHead>
                        </TableRow>
                      </TableHeader>

                      {periodo > 0 &&
                        mesesjurosCompostos.map((_, index) => {
                          let raizYear: number;
                          const taxaMensal = rendimentoGrafico.filter(
                            (e) => e.Ativo === "Shield Bank"
                          );

                          const taxYear: number = taxaMensal[0].Indexador;
                          // eslint-disable-next-line prefer-const
                          raizYear = taxYear / 100;

                          aporteJuros =
                            index === 0
                              ? aporteInicial * Number(raizYear)
                              : (jurosCompostos[index].totalJuros +
                                  (aporteMensal * index + aporteInicial)) *
                                Number(raizYear);

                          acumuladorJuros.push(aporteJuros);

                          const juroSobrejuros = acumuladorJuros.reduce(
                            (acc, current) => acc + current,
                            0
                          );

                          const totalInvestimentos =
                            aporteInicial + aporteMensal * index;
                          dadosGrafico.push({
                            id: index + 1,
                            aporte: totalInvestimentos,
                            juros: juroSobrejuros,
                          });
                          const dados: JurosCompostos = {
                            juros: aporteJuros,
                            totalJuros: juroSobrejuros,
                            totalAcumulado: juroSobrejuros + totalInvestimentos,
                          };

                          jurosCompostos.push(dados);

                          // console.log(
                          //   index === 0
                          //     ? aporteInicial * Number(raizYear)
                          //     : jurosCompostos[index].totalJuros +
                          //         (aporteMensal * index + aporteInicial)
                          // );
                          // console.log(jurosCompostos.map((e) => e));

                          return (
                            <>
                              <TableBody key={index} className=" h-[1rem]">
                                <TableRow className="max-md:h-max-[100%] ">
                                  <>
                                    <TableCell className="font-medium tdList sticky left-0 bg-slate-50 z-50  border border-gray-400 max-md:text-[0.9rem]   ">
                                      {`  ${index + 1} `}
                                    </TableCell>
                                    <TableCell className="font-medium tdList border-y border-gray-400 max-md:text-[0.9rem]  ">
                                      {formattedReal(aporteJuros)}
                                    </TableCell>
                                    <TableCell className="font-medium tdList border-y border-gray-400 max-md:text-[0.9rem] ">
                                      {formattedReal(totalInvestimentos)}
                                    </TableCell>

                                    <TableCell className="font-medium tdList border-y border-gray-400 max-md:text-[0.9rem] ">
                                      {formattedReal(juroSobrejuros)}
                                    </TableCell>

                                    <TableCell className="font-medium tdList border-y border-gray-400 max-md:text-[0.9rem] ">
                                      {formattedReal(
                                        juroSobrejuros + totalInvestimentos
                                      )}
                                    </TableCell>
                                  </>
                                </TableRow>
                              </TableBody>
                            </>
                          );
                        })}
                    </Table>
                    <div className="max-md:flex no-print print:hidden max-md:w-auto hidden ">
                      <div className=" ">
                        <p className="text-sm text-gray-500 float-left mt-2 max-sm:text-xs ml-[1rem]">
                          Role a tabela para o lado{" "}
                        </p>
                        <span className="inline-block animate-pulse  justify-center items-center pl-[1rem]">
                          <img className="w-[2rem] " src={Seta} />
                        </span>
                      </div>
                    </div>
                  </Card>
                  <div className="flex bloco-inteiro  gap-10 max-md:gap-0 justify-center items-center w-full max-md:flex max-md:flex-col max-md:justify-center max-md:items-center">
                    <Card className="no-break  w-full border-0    bg-transparent  max-md:mb-10  max-sm:max-w-full  max-md:items-center  text-black gap-3">
                      <CardHeader className="w-full justify-center items-center">
                        <CardTitle className="text-3xl max-md:text-xl max-md:text-center">
                          Grafico de Juros + Investimentos
                        </CardTitle>
                      </CardHeader>
                      <CardContent className=" grafico bg-gray-900 rounded-4xl p-5 max-md:p-2 ">
                        <ChartContainer
                          config={chartConfigDados}
                          className=" w-full  max-sm:h-[250px]  max-sm:w-[380px]   text-amber-50"
                        >
                          <LineChart
                            accessibilityLayer
                            data={dadosGrafico}
                            margin={{
                              left: 0,
                              right: 0,
                              top: 20,
                              bottom: 0,
                            }}
                            style={{
                              fill: "#ffffff",
                              style: { fill: "#ffffff" },
                            }}
                          >
                            <CartesianGrid
                              vertical={false}
                              stroke="#6b72807d "
                              strokeDasharray="3 3"
                              // stroke="#e5e7eb"
                            />
                            <XAxis
                              dataKey="id"
                              interval="preserveStartEnd"
                              tickLine={false}
                              axisLine={false}
                              className="text-amber-50"
                              tick={{
                                fill: "#ffffff",
                                style: { fill: "#ffffff" },
                              }}
                              tickFormatter={(value) => value}
                              tickMargin={8}
                            />{" "}
                            <YAxis
                              tick={{
                                fill: "#ffffff",
                                style: { fill: "#ffffff" },
                              }}
                              yAxisId="aporteY"
                              orientation="left"
                              axisLine={false}
                              tickLine={false}
                            />
                            <YAxis
                              yAxisId="jurosY"
                              orientation="right"
                              tickLine={false}
                              axisLine={false}
                            />
                            <ChartTooltip
                              cursor={false}
                              content={<ChartTooltipContent />}
                            />
                            <Line
                              yAxisId="aporteY"
                              dataKey="aporte"
                              name="Aportes"
                              stroke="var(--color-Investimentos)"
                              fill="var(--color-Investimentos)"
                              type="linear"
                              strokeWidth={2}
                              isAnimationActive={true}
                              animationDuration={1000}
                              animationEasing="ease-in-out"
                            />
                            <Line
                              dataKey="juros"
                              yAxisId="jurosY"
                              name="Juros"
                              stroke="var(--color-Juros)"
                              fill="var(--color-Juros)"
                              type="monotone"
                              strokeWidth={2}
                            />
                            <Legend verticalAlign="bottom" align="center" />
                          </LineChart>
                        </ChartContainer>
                      </CardContent>
                      <CardFooter>
                        <div className="flex w-full items-start gap-2 text-sm">
                          <div className="grid gap-2">
                            {/* <div className="flex items-center gap-2 leading-none font-medium">
                        Comparando o Crescimento de Juros Compostos e Aportes
                        <TrendingUp className="h-4 w-4" />
                      </div> */}
                          </div>
                        </div>
                      </CardFooter>
                    </Card>

                    <Card
                      id="pagina-comparativo"
                      className=" pdf-block w-full card no-break  max-md:-mt-15 border-0    bg-transparent  max-md:mb-10  max-sm:max-w-full  max-md:items-center  text-black gap-3"
                    >
                      <CardHeader className="w-full justify-center items-center">
                        <CardTitle className="text-3xl max-md:text-xl">
                          Grafico comparativo
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="flex grafico text-amber-50 bg-gray-900 p-10 rounded-4xl max-md:p-5">
                        <ChartContainer
                          config={chartConfig}
                          className="w-full max-sm:w-[350px] max-sm:h-[280px]    "
                        >
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                              accessibilityLayer
                              data={rendimentoGrafico}
                              barCategoryGap={10}
                              barGap={4}
                            >
                              <CartesianGrid
                                vertical={false}
                                stroke="#6b72807d "
                              />
                              <XAxis
                                className="text-[1rem] max-md:text-[0.7rem]"
                                dataKey="Ativo"
                                tickMargin={8}
                                tick={{
                                  fill: "#ffffff",
                                  style: { fill: "#ffffff" },
                                }}
                                tickFormatter={(value) => value.slice(0, 7)}
                              />
                              <ChartTooltip content={<ChartTooltipContent />} />
                              <ChartLegend
                                verticalAlign="bottom"
                                align="center"
                                className="max-md:mb-2"
                                wrapperStyle={{ color: "#fff" }}
                                content={<ChartLegendContent />}
                              />

                              <Bar
                                dataKey="Rendimento_Período_real"
                                fill="var(--color-Rendimento_Período_real)"
                                radius={4}
                                barSize={barSize}
                                className=""
                              />

                              <Bar
                                dataKey="Rendimento_Líquido_Imposto"
                                fill="var(--color-Rendimento_Líquido_Imposto)"
                                radius={4}
                                barSize={barSize}
                              />
                            </BarChart>
                          </ResponsiveContainer>
                        </ChartContainer>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </>
            )}
            {/* Tabela de Rendimento */}
            <Card className="no-pdfF print:hidden break-inside-avoid max-w-full h-full -mt-10  max-sm:max-w-full max-sm:mt-0 bg-transparent max-md:h-[30rem]   border-0   ">
              <CardTitle className="text-black text-3xl ">
                Comparativo de taxas
              </CardTitle>
              <Table className="border-t-1 border-gray-400   bg-slate-50 text-black   mt-1  rounded-b-3xl   ">
                <TableHeader className="bg-gray-900 text-amber-50 ">
                  <TableRow className="border-0  rounded-3xl  ">
                    <TableHead className="font-medium sticky left-0 bg-gray-900  border-0  z-50 min-w-[100px] max-w-[10px] ">
                      Ativo
                    </TableHead>
                    <TableHead className=" ">Taxa</TableHead>
                    <TableHead className=" ">Taxa a.a.</TableHead>
                    <TableHead className="">Taxa a.m.</TableHead>

                    <TableHead className="">
                      {" "}
                      Rendimento no Período (R$){" "}
                    </TableHead>
                    <TableHead className="">
                      {" "}
                      Rendimento + Valor investido (R$){" "}
                    </TableHead>
                    <TableHead className=""> Aliquota de Imposto </TableHead>
                    <TableHead className="">
                      {" "}
                      Rendimento Líquido de Imposto{" "}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                {rendimentoGrafico.map((e, i) => {
                  let raizYear;
                  let aliquota;

                  switch (e.Ativo) {
                    case "Shield Bank": {
                      const taxYear: number = e.Indexador;
                      raizYear = taxYear / 100;
                      // raizYear = e.Indexador / 100;
                      break;
                    }
                    case "CDB Pós Fixado": {
                      const taxYear: number =
                        (e.Indexador * (CDIAno ?? 0)) / 100;
                      raizYear = (taxYear / 100 + 1) ** (1 / 12) - 1;
                      break;
                    }
                    case "Tesouro Pré Fixado": {
                      const taxYear: number = e.Indexador;

                      raizYear = (taxYear / 100 + 1) ** (1 / 12) - 1;
                      break;
                    }
                    case "CRA Inflação": {
                      const taxYear: number = e.Indexador + Number(inflacao);

                      raizYear = (taxYear / 100 + 1) ** (1 / 12) - 1;
                      break;
                    }
                    case "Poupança": {
                      const taxYear: number = 0.0744;

                      raizYear = (taxYear + 1) ** (1 / 12) - 1;
                      break;
                    }
                    default:
                  }

                  if (selectedOption === 0) {
                    if (periodo >= 0 && periodo <= 6) {
                      aliquota = 22.5;
                    } else if (periodo > 6 && periodo <= 12) {
                      aliquota = 20;
                    } else if (periodo > 12 && periodo <= 24) {
                      aliquota = 17.5;
                    } else {
                      aliquota = 15;
                    }
                  }

                  if (selectedOption === 1) {
                    if (periodo >= 1 && periodo <= 2) {
                      aliquota = 17.5;
                    } else {
                      aliquota = 15;
                    }
                  }
                  const formmatedPercent = new Intl.NumberFormat("pt-BR", {
                    style: "percent",
                    currency: "BRL",
                    minimumFractionDigits: 2,
                  }).format(raizYear ?? 0);
                  const vf =
                    aporteInicial *
                      (1 + (raizYear ?? 0)) **
                        (selectedOption === 0 ? periodo : periodo * 12) +
                    aporteMensal *
                      (((1 + (raizYear ?? 0)) **
                        (selectedOption === 0 ? periodo : periodo * 12) -
                        1) /
                        (raizYear ?? 0));
                  const rendimentoPeriodoValorInvestido =
                    Number(aporteInicial) +
                    Number(aporteMensal) *
                      (selectedOption === 0 ? periodo : periodo * 12);
                  // const rendimentoPeriodoPercent =
                  //   (vf - rendimentoPeriodoValorInvestido) /
                  //   rendimentoPeriodoValorInvestido;

                  const rendimentoPeriodo =
                    vf - rendimentoPeriodoValorInvestido;
                  const rendimentoLiquidoImposto =
                    rendimentoPeriodo - rendimentoPeriodo * (aliquota! / 100);

                  // eslint-disable-next-line react-hooks/rules-of-hooks
                  useEffect(() => {
                    switch (e.Ativo) {
                      case "Shield Bank":
                        setRendimentoGrafico((state) =>
                          state.map((e, i) =>
                            i === 0
                              ? {
                                  ...e,
                                  Rendimento_Líquido_Imposto:
                                    rendimentoLiquidoImposto,
                                  Rendimento_Período_real: rendimentoPeriodo,
                                  Rendimento_Valor_investido:
                                    rendimentoPeriodoValorInvestido,
                                }
                              : e
                          )
                        );
                        break;
                      case "CDB Pós Fixado":
                        setRendimentoGrafico((state) =>
                          state.map((e, i) =>
                            i === 1
                              ? {
                                  ...e,
                                  Rendimento_Líquido_Imposto:
                                    rendimentoLiquidoImposto,
                                  Rendimento_Período_real: rendimentoPeriodo,
                                  Rendimento_Valor_investido:
                                    rendimentoPeriodoValorInvestido,
                                }
                              : e
                          )
                        );
                        break;

                      case "Tesouro Pré Fixado":
                        setRendimentoGrafico((state) =>
                          state.map((e, i) =>
                            i === 2
                              ? {
                                  ...e,
                                  Rendimento_Líquido_Imposto:
                                    rendimentoLiquidoImposto,
                                  Rendimento_Período_real: rendimentoPeriodo,
                                  Rendimento_Valor_investido:
                                    rendimentoPeriodoValorInvestido,
                                }
                              : e
                          )
                        );
                        break;
                      case "CRA Inflação":
                        setRendimentoGrafico((state) =>
                          state.map((e, i) =>
                            i === 3
                              ? {
                                  ...e,
                                  Rendimento_Líquido_Imposto: rendimentoPeriodo,
                                  Rendimento_Período_real: rendimentoPeriodo,
                                  Rendimento_Valor_investido:
                                    rendimentoPeriodoValorInvestido,
                                }
                              : e
                          )
                        );
                        break;
                      case "Poupança":
                        setRendimentoGrafico((state) =>
                          state.map((e, i) =>
                            i === 4
                              ? {
                                  ...e,
                                  Rendimento_Líquido_Imposto: rendimentoPeriodo,
                                  Rendimento_Período_real: rendimentoPeriodo,
                                  Rendimento_Valor_investido:
                                    rendimentoPeriodoValorInvestido,
                                }
                              : e
                          )
                        );
                        break;
                    }
                  }, [
                    CDIAno,
                    inflacao,
                    periodo,
                    aporteInicial,
                    aporteMensal,
                    selectedOption,
                    rendimentoGrafico[0].Indexador,
                  ]);
                  return (
                    <TableBody key={i}>
                      <TableRow>
                        <>
                          <TableCell className="font-medium sticky left-0 bg-slate-50 z-50 border border-gray-400 ">
                            {e.Ativo}
                          </TableCell>
                          <TableCell className="font-medium z-10  border-y border-gray-400">
                            {`${e.Indexador}% ${
                              e.Ativo === "CDB Pós Fixado"
                                ? "do CDI"
                                : e.Ativo === "Tesouro Pré Fixado"
                                ? "a.a"
                                : e.Ativo === "CRA Inflação"
                                ? " + IPCA"
                                : ""
                            }`}
                          </TableCell>
                          <TableCell className="font-medium border-y border-gray-400">
                            {`${
                              e.Ativo === "Shield Bank"
                                ? `${(e.Indexador * 12).toFixed(2)}%`
                                : // ? `${(e.Indexador * 12).toFixed(2)}%`
                                e.Ativo === "CDB Pós Fixado"
                                ? `${(
                                    (e.Indexador * (CDIAno ?? 0)) /
                                    100
                                  ).toFixed(2)}%`
                                : e.Ativo === "Tesouro Pré Fixado"
                                ? `${e.Indexador}%`
                                : e.Ativo === "CRA Inflação"
                                ? `${
                                    e.Indexador + Number(inflacao.toFixed(2))
                                  }%`
                                : "7,44%"
                            }`}
                          </TableCell>
                          <TableCell className="font-medium border-y border-gray-400 ">
                            {formmatedPercent}
                          </TableCell>

                          <TableCell className="font-medium border-y border-gray-400">
                            {formattedReal(rendimentoPeriodo)}
                          </TableCell>
                          <TableCell className="font-medium border-y border-gray-400">
                            {formattedReal(vf)}
                          </TableCell>
                          <TableCell className="font-medium border-y border-gray-400">
                            {e.Ativo === "CRA Inflação"
                              ? "isento"
                              : e.Ativo === "Poupança"
                              ? "isento"
                              : formmatedN(aliquota! / 100)}
                          </TableCell>
                          <TableCell className="font-medium border-y border-gray-400">
                            {e.Ativo === "CRA Inflação"
                              ? formattedReal(rendimentoPeriodo)
                              : e.Ativo === "Poupança"
                              ? formattedReal(rendimentoPeriodo)
                              : formattedReal(rendimentoLiquidoImposto)}
                          </TableCell>
                        </>
                      </TableRow>
                    </TableBody>
                  );
                })}
              </Table>

              <div className="max-md:flex hidden no-print print:hidden">
                <div className="items-center ">
                  <p className="text-sm text-gray-500 float-left mt-2 max-sm:text-xs ml-[1rem]">
                    Role a tabela para o lado{" "}
                  </p>
                  <span className="inline-block animate-pulse  justify-center items-center pl-[1rem]">
                    <img className="w-[2rem] " src={Seta} />
                  </span>
                </div>
              </div>
            </Card>
          </div>
          <footer className=" p-0 m-0 text-black text-center mt-10   ">
            <p> © 2025 Shield Bank</p>
          </footer>
        </div>
      </div>
    </>
  );
}

export default App;
