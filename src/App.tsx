/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardTitle } from "./components/ui/card";
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
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import { Label } from "./components/ui/label";

import SHIELDBANK from "../assets/SHIELDBANK.png";
import { Button } from "./components/ui/button";
import axios from "axios";

function App() {
  const [CDIAno, setCDIAno] = useState<number>();
  const [inflacao, setInflacao] = useState<number>(0);
  const [periodo, setPeriodo] = useState<number>(0);
  const [aporteInicial, setaporteInicial] = useState<number>(0);
  const [aporteMensal, setaporteMensal] = useState<number>(0);
  const [indexador, setIndexador] = useState<boolean>(false);

  const [aporteInicialJuros, setAporteInicialJuros] = useState(0);
  const [aporteMensalJuros, setaporteMensalJuros] = useState(0);

  const values = [
    {
      Ativo: "Shield Pay",
      Indexador: 150,
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
      Indexador: 110,
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

  // const chartConfig = {
  //   desktop: {
  //     label: "Desktop",
  //     color: "var(--chart-1)",
  //   },
  //   mobile: {
  //     label: "Mobile",
  //     color: "var(--chart-2)",
  //   },
  // } satisfies ChartConfig;

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
  const dateformattedInitial = `01/${getMonthFormatted}/${getYearFormatted}`;

  const dateformattedInflacao = `01/01/${getYearFormatted}`;

  const urlBancoCentral = `https://api.bcb.gov.br/dados/serie/bcdata.sgs.12/dados?formato=json&dataInicial=${dateformattedInitial}&dataFinal=${dateformatted}`;
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
    return new Intl.NumberFormat("pt-BR", {
      style: "percent",
      currency: "BRL",
      minimumFractionDigits: 2,
    }).format(n);
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
    const mesesTotais = getMonth + 1 + periodo;
    for (let i = getMonth + 1; i < mesesTotais; i++) {
      console.log(i);
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
  }, [periodo]);
  let aporteJuros = aporteInicial + aporteMensal;
  const chartConfig = {
    Rendimento_Período_real: {
      label: "Rendimento Período",
      color: "#2563eb",
    },

    Rendimento_Líquido_Imposto: {
      label: "Rendimento Líquido",
      color: "#60a5fa",
    },
  } satisfies ChartConfig;
  const acumuladorJuros = [];

  // const chartData = [
  //   { month: "January", desktop: 186, mobile: 80 },
  //   { month: "February", desktop: 305, mobile: 200 },
  //   { month: "March", desktop: 237, mobile: 120 },
  //   { month: "April", desktop: 73, mobile: 190 },
  //   { month: "May", desktop: 209, mobile: 130 },
  //   { month: "June", desktop: 214, mobile: 140 },
  // ];
  // const chartConfig1 = {
  //   desktop: {
  //     label: "Desktop",
  //     color: "var(--chart-1)",
  //   },
  //   mobile: {
  //     label: "Mobile",
  //     color: "var(--chart-2)",
  //   },
  // } satisfies ChartConfig;
  return (
    <>
      <div className=" h-auto  border-0 w-full p-10 py-30 max-md:py-30 flex justify-center ">
        <div className="w-full  max-md:flex max-md:flex-col max-md:justify-center">
          <div className=" w-full flex justify-around  max-md:flex max-md:flex-col    ">
            <img className="w-[40%] max-md:w-full -mt-40 " src={SHIELDBANK} />

            <Card className="w-[40%]  max-md:w-full max-md:mb-10  h-full bg-[#e9e9e9] border-0 rounded-2xl p-10 text-amber-50 gap-3">
              <Label htmlFor="aporteInicial">Aporte Inicial</Label>

              <Input
                id="aporteInicial"
                type="text"
                placeholder="aporte inicial"
                value={formattedReal(aporteInicial)}
                onChange={(e) => {
                  const apenasNumeros = e.target.value.replace(/[\D]/g, "");
                  setaporteInicial(Number(apenasNumeros) / 100);
                }}
              />

              <Label htmlFor="aporteMensal">Aporte Mensal</Label>

              <Input
                id="aporteMensal"
                type="text"
                placeholder="aporte mensal"
                value={formattedReal(aporteMensal)}
                onChange={(e) => {
                  const apenasNumeros = e.target.value.replace(/[\D]/g, "");

                  setaporteMensal(Number(apenasNumeros) / 100);
                }}
              />
              <Label htmlFor="periodo">Periodo do Aporte</Label>

              <Input
                id="periodo"
                type="text"
                placeholder="periodo (mês)"
                onChange={(e) => setPeriodo(Number(e.target.value))}
              />
              <Label htmlFor="CDI">CDI (ano)</Label>

              <Input
                className="bg-transparent text-[#162456] text-2xl disabled:opacity-80"
                id="CDI"
                type="text"
                disabled
                placeholder="CDI (ano)"
                value={formmatedN((CDIAno ?? 1) / 100)}
                onChange={(e) => setCDIAno(Number(e.target.value))}
              />

              <Label htmlFor="inflação">inflação (ano)</Label>

              <Input
                className="bg-transparent text-[#162456] text-2xl disabled:opacity-80"
                id="inflação"
                type="text"
                disabled
                placeholder="inflação (ano)"
                value={formmatedN(inflacao / 100)}
                onChange={(e) => setInflacao(Number(e.target.value))}
              />
            </Card>
          </div>
          {rendimentoGrafico[0].Rendimento_Líquido_Imposto > 0 && (
            <Card className="w-full  flex  max-md:w-full max-md:mb-10  h-auto mt-5  bg-[#e9e9e9]   border-0 rounded-2xl p-5 text-amber-50">
              <div className="  w-full flex justify-center max-md:gap-0 gap-20 max-md:flex-col">
                <Card className="transition-transform duration-300 ease-in-out hover:animate-pulse bg-[#162456] w-full  shadow-2xl max-md:w-full max-md:h-[7rem] max-md:mb-10  max-md:p-1 justify-center items-center max-md:gap-0 h-28 border-0 rounded-2xl p-10  gap-3">
                  <div className="  flex  flex-col gap-2 justify-center items-center">
                    <h1 className="text-3xl   text-amber-50 ">Valor Total</h1>
                    <Label
                      htmlFor="Valor Total"
                      className="text-4xl  text-amber-50 "
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
                    <h1 className="text-3xl text-blue-950">Valor Investido</h1>
                    <Label htmlFor="Valor Investido" className="text-4xl">
                      {formattedReal(
                        rendimentoGrafico[0].Rendimento_Valor_investido
                      )}
                    </Label>
                  </div>
                </Card>
                <Card className=" max-md:w-full  w-full shadow-2xl max-md:h-[7rem] max-md:mb-10  max-md:p-1 justify-center items-center max-md:gap-0 h-28 bg-[#e9e9e9] border-0 rounded-2xl p-10 text-amber-50 gap-3">
                  <div className="  flex  flex-col gap-2 justify-center items-center">
                    <h1 className="text-3xl  text-blue-950">Juros Totais</h1>
                    <Label
                      htmlFor="periodo"
                      className="text-4xl  text-blue-950"
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
          )}
          <div className="h-full  ">
            {/* Tabela de Rendimento por mes  */}
            <Card className="">
              <CardTitle className="text-amber-50">
                Tabela De Rendimentos 💰
              </CardTitle>
              <Table className="bg-[#171717] text-amber-50 ">
                <TableHeader className="">
                  <TableRow className="border-[#ffffff26]">
                    <TableHead className="font-medium sticky left-0 bg-[#171717]  z-50 min-w-[100px]  ">
                      Meses
                    </TableHead>
                    <TableHead className="min-w-[160px] ">Juros</TableHead>
                    <TableHead className="min-w-[160px] ">
                      Total Investido
                    </TableHead>
                    <TableHead className="min-w-[160px] ">
                      Total Juros
                    </TableHead>
                    <TableHead className="min-w-[160px] ">
                      Total Acumulado
                    </TableHead>
                  </TableRow>
                </TableHeader>

                {periodo > 0 &&
                  mesesjurosCompostos.map((e, index) => {
                    let raizYear;
                    const taxaMensal = rendimentoGrafico.filter(
                      (e) => e.Ativo === "Shield Pay"
                    );

                    const taxYear: number =
                      (taxaMensal[0].Indexador * (CDIAno ?? 0)) / 100;
                    raizYear = (taxYear / 100 + 1) ** (1 / 12) - 1;

                    aporteJuros =
                      index === 0
                        ? aporteInicial * Number(raizYear.toFixed(3))
                        : (aporteMensal * index + aporteInicial) *
                          Number(raizYear.toFixed(3));

                    acumuladorJuros.push(aporteJuros);
                    console.log(aporteJuros);

                    const juroSobrejuros = acumuladorJuros.reduce(
                      (acc, current) => acc + current,
                      0
                    );
                    // console.log(acumuladorJuros);
                    const AporteRendimento =
                      index === 0
                        ? aporteInicial + aporteJuros
                        : aporteInicial * (index + 1) +
                          aporteMensal +
                          aporteJuros;

                    const totalInvestimentos =
                      index === 0 ? aporteInicial : aporteMensal * (index + 1);

                    return (
                      <TableBody key={index}>
                        <TableRow>
                          <>
                            <TableCell className="font-medium sticky left-0 bg-[#171717] z-50  ">
                              {e}
                            </TableCell>
                            <TableCell className="font-medium">
                              {formattedReal(aporteJuros)}
                            </TableCell>
                            <TableCell className="font-medium">
                              {formattedReal(totalInvestimentos)}
                            </TableCell>

                            <TableCell className="font-medium">
                              {formattedReal(juroSobrejuros)}
                            </TableCell>

                            <TableCell className="font-medium">
                              {formattedReal(
                                juroSobrejuros + totalInvestimentos
                              )}
                            </TableCell>
                            {/* <TableCell className="font-medium">
                            {formattedReal(rendimentoPeriodo)}
                          </TableCell>
                          <TableCell className="font-medium">
                            {formattedReal(vf)}
                          </TableCell>
                          <TableCell className="font-medium">
                            {e.Ativo === "CRA Inflação"
                              ? formattedReal(rendimentoPeriodo)
                              : e.Ativo === "Poupança"
                              ? formattedReal(rendimentoPeriodo)
                              : formattedReal(rendimentoLiquidoImposto)}
                          </TableCell> */}
                          </>
                        </TableRow>
                      </TableBody>
                    );
                  })}
              </Table>
            </Card>
            {/* Tabela de Rendimento   */}

            <Card className="">
              <div className="flex gap-4 items-center">
                <h2 className="text-amber-50">Trocar Taxa Shield?</h2>
                {indexador === false ? (
                  <Button
                    type="button"
                    className="bg-amber-50 rounded-[0.7rem] w-10 border-0 hover:bg-[#162456] hover:text-amber-50 hover:border-0"
                    variant="outline"
                    onClick={() => setIndexador(true)}
                  >
                    Sim
                  </Button>
                ) : (
                  <Button
                    type="button"
                    className="bg-amber-50 rounded-[0.7rem] w-10  border-0 hover:bg-red-800 hover:text-amber-50 hover:border-0"
                    variant="outline"
                    onClick={() => setIndexador(false)}
                  >
                    Não
                  </Button>
                )}
              </div>

              {indexador && (
                <Card className="w-[12%] h-[20%] max-md:w-full max-md:mb-10   bg-[#e9e9e9] border-0 rounded-2xl p-4 text-amber-50 gap-3">
                  <Label className="" htmlFor="CDI">
                    <Input
                      className="w-10 text-amber-50"
                      id="Taxa Shield"
                      type="text"
                      placeholder="Taxa Shield"
                      value={rendimentoGrafico[0].Indexador || 0}
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
                    Taxa Shield
                  </Label>
                  {/* 
                  <Label htmlFor="a.a">
                    <Input
                      className="w-20 text-amber-50"
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
                    a.a
                  </Label>

                  <Label htmlFor=" + IPCA">
                    <Input
                      className="w-20 text-amber-50"
                      id=" + IPCA"
                      type="text"
                      placeholder="periodo (mês)"
                      value={rendimentoGrafico[2].Indexador || 0}
                      onChange={(ipca) =>
                        setRendimentoGrafico((state) =>
                          state.map((e, i) =>
                            i === 2
                              ? { ...e, Indexador: Number(ipca.target.value) }
                              : e
                          )
                        )
                      }
                    />
                    + IPCA
                  </Label> */}
                </Card>
              )}

              <CardTitle className="text-amber-50">
                Tabela De Rendimentos 💰
              </CardTitle>
              <Table className="bg-[#171717] text-amber-50 ">
                <TableHeader className="">
                  <TableRow className="border-[#ffffff26]">
                    <TableHead className="font-medium sticky left-0 bg-[#171717]  z-50 min-w-[100px] max-w-[10px]">
                      Ativo
                    </TableHead>
                    <TableHead>Indexador</TableHead>
                    <TableHead> Rendimento no Período (R$) </TableHead>
                    <TableHead> Rendimento + Valor investido (R$) </TableHead>
                    <TableHead> Rendimento Líquido de Imposto </TableHead>
                  </TableRow>
                </TableHeader>

                {rendimentoGrafico.map((e, i) => {
                  let raizYear;
                  let aliquota;

                  switch (e.Ativo) {
                    case "Shield Pay": {
                      const taxYear: number =
                        (e.Indexador * (CDIAno ?? 0)) / 100;
                      raizYear = (taxYear / 100 + 1) ** (1 / 12) - 1;
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

                  if (periodo >= 0 && periodo < 6) {
                    aliquota = 22.5;
                  } else if (periodo >= 6 && periodo < 12) {
                    aliquota = 20;
                  } else if (periodo >= 12 && periodo < 24) {
                    aliquota = 17.5;
                  } else {
                    aliquota = 15;
                  }

                  const vf =
                    aporteInicial * (1 + (raizYear ?? 0)) ** periodo +
                    aporteMensal *
                      (((1 + (raizYear ?? 0)) ** periodo - 1) /
                        (raizYear ?? 0));

                  const rendimentoPeriodoValorInvestido =
                    Number(aporteInicial) + Number(aporteMensal) * periodo;

                  const rendimentoPeriodo =
                    vf - rendimentoPeriodoValorInvestido;
                  const rendimentoLiquidoImposto =
                    rendimentoPeriodo - rendimentoPeriodo * (aliquota / 100);

                  // eslint-disable-next-line react-hooks/rules-of-hooks
                  useEffect(() => {
                    switch (e.Ativo) {
                      case "Shield Pay":
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
                    // eslint-disable-next-line react-hooks/exhaustive-deps
                    rendimentoGrafico[0].Indexador,
                  ]);

                  return (
                    <TableBody key={i}>
                      <TableRow>
                        <>
                          <TableCell className="font-medium sticky left-0 bg-[#171717] z-50  ">
                            {e.Ativo}
                          </TableCell>

                          <TableCell className="font-medium">
                            {formattedReal(rendimentoPeriodo)}
                          </TableCell>
                          <TableCell className="font-medium">
                            {formattedReal(vf)}
                          </TableCell>
                          <TableCell className="font-medium">
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
            </Card>
            {/* Tabela de Rendimento Detalhado  */}

            <Card>
              <CardTitle className="text-amber-50 ">
                Tabela De Rendimentos Detalhada 📃💰
              </CardTitle>
              <Table className="bg-[#171717] text-amber-50 mt-1">
                <TableHeader className="">
                  <TableRow className="border-[#ffffff26]">
                    <TableHead className="font-medium sticky left-0 bg-[#171717]  z-50 min-w-[100px] max-w-[10px]">
                      Ativo
                    </TableHead>
                    <TableHead>Indexador</TableHead>
                    <TableHead>Taxa a.a.</TableHead>
                    <TableHead>Taxa a.m.</TableHead>
                    <TableHead> Rendimento no Período (%)</TableHead>
                    <TableHead> Rendimento no Período (R$) </TableHead>
                    <TableHead> Rendimento + Valor investido (R$) </TableHead>
                    <TableHead> Aliquota de Imposto </TableHead>
                    <TableHead> Rendimento Líquido de Imposto </TableHead>
                  </TableRow>
                </TableHeader>
                {rendimentoGrafico.map((e, i) => {
                  let raizYear;
                  let aliquota;

                  switch (e.Ativo) {
                    case "Shield Pay": {
                      const taxYear: number =
                        (e.Indexador * (CDIAno ?? 0)) / 100;
                      raizYear = (taxYear / 100 + 1) ** (1 / 12) - 1;
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

                  if (periodo >= 0 && periodo < 6) {
                    aliquota = 22.5;
                  } else if (periodo >= 6 && periodo < 12) {
                    aliquota = 20;
                  } else if (periodo >= 12 && periodo < 24) {
                    aliquota = 17.5;
                  } else {
                    aliquota = 15;
                  }
                  const formmatedPercent = new Intl.NumberFormat("pt-BR", {
                    style: "percent",
                    currency: "BRL",
                    minimumFractionDigits: 2,
                  }).format(raizYear ?? 0);
                  const vf =
                    aporteInicial * (1 + (raizYear ?? 0)) ** periodo +
                    aporteMensal *
                      (((1 + (raizYear ?? 0)) ** periodo - 1) /
                        (raizYear ?? 0));
                  const rendimentoPeriodoValorInvestido =
                    Number(aporteInicial) + Number(aporteMensal) * periodo;
                  const rendimentoPeriodoPercent =
                    (vf - rendimentoPeriodoValorInvestido) /
                    rendimentoPeriodoValorInvestido;

                  const rendimentoPeriodo =
                    vf - rendimentoPeriodoValorInvestido;
                  const rendimentoLiquidoImposto =
                    rendimentoPeriodo - rendimentoPeriodo * (aliquota / 100);

                  return (
                    <TableBody key={i}>
                      <TableRow>
                        <>
                          <TableCell className="font-medium sticky left-0 bg-[#171717] z-50  ">
                            {e.Ativo}
                          </TableCell>
                          <TableCell className="font-medium z-10">
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
                          <TableCell className="font-medium">
                            {`${
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
                          <TableCell className="font-medium">
                            {formmatedPercent}
                          </TableCell>
                          <TableCell className="font-medium">
                            {formmatedN(rendimentoPeriodoPercent)}
                          </TableCell>
                          <TableCell className="font-medium">
                            {formattedReal(rendimentoPeriodo)}
                          </TableCell>
                          <TableCell className="font-medium">
                            {formattedReal(vf)}
                          </TableCell>
                          <TableCell className="font-medium">
                            {e.Ativo === "CRA Inflação"
                              ? "isento"
                              : e.Ativo === "Poupança"
                              ? "isento"
                              : formmatedN(aliquota / 100)}
                          </TableCell>
                          <TableCell className="font-medium">
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
            </Card>
            <div className=" w-full h-[60%] flex  justify-center mb-10  ">
              <Card className="  p-0 ">
                <CardContent className="   w-full  flex  text-amber-50 ">
                  <ChartContainer
                    config={chartConfig}
                    className=" w-[50rem] h-[20rem] max-md:w-[25rem]"
                  >
                    <BarChart
                      accessibilityLayer
                      data={rendimentoGrafico}
                      barCategoryGap={10}
                      barGap={4}
                    >
                      <CartesianGrid vertical={false} />
                      <XAxis
                        className="text-[1rem] max-md:text-[0.7rem]"
                        dataKey="Ativo"
                        tickMargin={4}
                        tick={{
                          fill: "#ffffff",
                          style: { fill: "#ffffff" },
                        }}
                        tickFormatter={(value) => value.slice(0, 15)}
                      />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <ChartLegend
                        verticalAlign="bottom"
                        align="center"
                        className="max-md:mb-12"
                        wrapperStyle={{ color: "#fff" }}
                        content={<ChartLegendContent />}
                      />

                      <Bar
                        dataKey="Rendimento_Período_real"
                        fill="var(--color-Rendimento_Período_real)"
                        radius={4}
                        barSize={barSize}
                      />

                      <Bar
                        dataKey="Rendimento_Líquido_Imposto"
                        fill="var(--color-Rendimento_Líquido_Imposto)"
                        radius={4}
                        barSize={barSize}
                      />
                    </BarChart>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
