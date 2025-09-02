import { useState, type SetStateAction } from "react";
import { Card } from "./components/ui/card";
import { Input } from "./components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./components/ui/table";

function App() {
  const [CDIAno, setCDIAno] = useState<SetStateAction<number>>(0);
  const [inflacao, setInflacao] = useState<number>(0);
  const [periodo, setPeriodo] = useState<SetStateAction<HTMLInputElement>>(0);
  const [aporteInicial, setaporteInicial] = useState<number>(0);
  const [aporteMensal, setaporteMensal] = useState<number>(0);

  const values = [
    {
      Ativo: "CDB Pós Fixado",
      Indexador: 120,
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
  console.log({ aporteInicial, aporteMensal, periodo, CDIAno, inflacao });
  return (
    <>
      <div className="bg-gray-950 min-h-screen border-0 w-full p-10 py-20">
        <div className=" grid grid-rows-2 grid-cols-3">
          <div className="row-start-1 row-end-3 ">
            <Card className="bg-[#171717] border-0 rounded-2xl p-15 text-amber-50">
              <Input
                type="text"
                placeholder="aporte inicial"
                value={formattedReal(aporteInicial)}
                onChange={(e) => {
                  setaporteInicial(e.target.value.replace(/[\D/]/g, "") / 100);
                }}
              />
              <Input
                type="text"
                placeholder="aporte mensal"
                value={formattedReal(aporteMensal)}
                onChange={(e) => {
                  setaporteMensal(e.target.value.replace(/[\D/]/g, "") / 100);
                }}
              />
              <Input
                type="text"
                placeholder="periodo (mês)"
                onChange={(e) => setPeriodo(e.target.value)}
              />
              <Input
                type="text"
                placeholder="CDI (ano)"
                onChange={(e) => setCDIAno(e.target.value)}
              />
              <Input
                type="text"
                placeholder="inflação (ano)"
                onChange={(e) => setInflacao(e.target.value)}
              />
            </Card>
          </div>
          <div className="row-end-4 col-start-1 col-end-4 mt-20 ">
            <Table className="bg-[#171717] text-amber-50 ">
              <TableHeader>
                <TableRow className="border-[#ffffff26]">
                  <TableHead className="font-medium">Ativo</TableHead>
                  <TableHead>Indexador</TableHead>
                  <TableHead>Taxa a.a.</TableHead>
                  <TableHead>Taxa a.m.</TableHead>
                  <TableHead> Rendimento no Período (%)</TableHead>
                  <TableHead> Rendimento no Período (R$) </TableHead>
                  <TableHead> Rendimento + Valor investido (R$) </TableHead>
                  <TableHead> Aliquota de Imposto </TableHead>
                  <TableHead> Rendimento Líquido de Imposto </TableHead>
                  {/* <TableHead className="text-right">Amount</TableHead> */}
                </TableRow>
              </TableHeader>
              {values.map((e) => {
                let tax;
                let raizYear;
                let aliquota;

                switch (e.Ativo) {
                  case "CDB Pós Fixado": {
                    const taxYear: number = (e.Indexador * CDIAno) / 100;
                    tax = taxYear;
                    raizYear = (taxYear / 100 + 1) ** (1 / 12) - 1;
                    break;
                  }
                  case "Tesouro Pré Fixado": {
                    const taxYear: number = e.Indexador;
                    tax = taxYear;

                    raizYear = (taxYear / 100 + 1) ** (1 / 12) - 1;
                    break;
                  }
                  case "CRA Inflação": {
                    const taxYear: number = e.Indexador + Number(inflacao);
                    tax = taxYear;

                    raizYear = (taxYear / 100 + 1) ** (1 / 12) - 1;
                    break;
                  }
                  case "Poupança": {
                    const taxYear: number = 0.0744;
                    tax = taxYear;

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
                }).format(raizYear);

                const vf =
                  aporteInicial * (1 + raizYear) ** periodo +
                  aporteMensal * (((1 + raizYear) ** periodo - 1) / raizYear);

                const rendimentoPeriodoValorInvestido =
                  Number(aporteInicial) + Number(aporteMensal) * 5;

                const rendimentoPeriodoPercent =
                  (vf - rendimentoPeriodoValorInvestido) /
                  rendimentoPeriodoValorInvestido;

                const rendimentoPeriodo = vf - rendimentoPeriodoValorInvestido;
                const rendimentoLiquidoImposto =
                  rendimentoPeriodo - rendimentoPeriodo * (aliquota / 100);

                return (
                  <TableBody>
                    <TableRow>
                      <>
                        <TableCell className="font-medium">{e.Ativo}</TableCell>
                        <TableCell className="font-medium">
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
                              ? `${(e.Indexador * CDIAno) / 100}%`
                              : e.Ativo === "Tesouro Pré Fixado"
                              ? `${e.Indexador}%`
                              : e.Ativo === "CRA Inflação"
                              ? `${e.Indexador + Number(inflacao)}%`
                              : "7,44%"
                          }`}
                        </TableCell>{" "}
                        <TableCell className="font-medium">
                          {formmatedPercent}
                        </TableCell>{" "}
                        <TableCell className="font-medium">
                          {formmatedN(rendimentoPeriodoPercent)}
                        </TableCell>{" "}
                        <TableCell className="font-medium">
                          {formattedReal(rendimentoPeriodo)}
                        </TableCell>{" "}
                        <TableCell className="font-medium">
                          {formattedReal(vf)}
                        </TableCell>{" "}
                        <TableCell className="font-medium">
                          {e.Ativo === "CRA Inflação"
                            ? "isento"
                            : e.Ativo === "Poupança"
                            ? "isento"
                            : formmatedN(aliquota / 100)}
                        </TableCell>
                        <TableCell className="font-medium">
                          {formattedReal(rendimentoLiquidoImposto)}
                        </TableCell>
                      </>
                    </TableRow>
                  </TableBody>
                );
              })}
            </Table>
            <Card className="rounded-2xl border-0 p-15 mt-15 text-amber-50">
              <div>Ativo</div>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
