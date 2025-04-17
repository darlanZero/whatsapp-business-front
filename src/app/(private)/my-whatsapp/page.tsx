import { Card, CardContent } from "@/components/ui/card";
import { fontSaira, fontInter } from "@/utils/fonts";



export default function Index() {
  return(
    <div className="space-y-6">
      <Card className="border-0 shadow-sm bg-gray-50">
        <CardContent className="p-6">
          <h2 className={`${fontSaira} text-xl font-medium text-indigo-700 mb-4`}>Informações Pessoais</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <p className={`${fontInter} text-sm font-medium text-indigo-500`}>Nome</p>
                <p className={`${fontInter} text-sm font-medium text-black`}>{"Marcos Vincius"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-indigo-500">Numero de celular</p>
                <p className={`${fontInter} text-sm font-medium text-black`}>{"84 992924"}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
)
}