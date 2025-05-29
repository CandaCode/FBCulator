import { generateE48Values, findNearestE48Value } from './utils/resistors.js'

// Precompute all E48 resistor values in kilo-ohms
const E48_ALL_VALUES = generateE48Values()

function App() {
  const [vref, setVref] = useState('')
  const [vout, setVout] = useState('')
  const [results, setResults] = useState([])


  const calculateResistorPairs = useMemo(() => {
    if (!vref || !vout) return []

    const targetCurrent = 10000
    const targetR1 = (vref / (targetCurrent * 1e-9)) / 1000
    const targetR2 = targetR1 * ((vout / vref) - 1)

    const searchRange = 0.5
    const minR1 = targetR1 * (1 - searchRange)
    const maxR1 = targetR1 * (1 + searchRange)

    const possiblePairs = []
    E48_ALL_VALUES.forEach(r1Value => {
      if (r1Value >= minR1 && r1Value <= maxR1) {
        const r2Value = r1Value * ((vout / vref) - 1)
        const nearestR2 = findNearestE48Value(r2Value)
        const current = (vref / (r1Value * 1000)) * 1e9
        const actualVoltage = vref * (1 + nearestR2 / r1Value)

        possiblePairs.push({
          r1: r1Value,
          r2: nearestR2,
          current,
          actualVoltage,
          error: Math.abs(actualVoltage - vout)
        })
      }
    })

    return possiblePairs
      .sort((a, b) => a.error - b.error)
      .slice(0, 5)
  }, [vref, vout])

  const calculate = () => {
    if (!vref || !vout) return
    setResults(calculateResistorPairs)
  }

  const isFormValid = () => {
    return vref && vout
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-text-primary mb-8">
          DC-DC外围反馈电阻计算器
        </h1>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="transform transition-all duration-300 hover:scale-[1.02]">
            <label className="block text-sm font-medium text-text-primary mb-1">
              参考电压 (V)
            </label>
            <input
              type="number"
              value={vref}
              onChange={(e) => setVref(parseFloat(e.target.value))}
              className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-card text-text-primary shadow-sm hover:shadow-md transition-shadow duration-300"
              placeholder="例如: 0.8"
            />
          </div>

          <div className="transform transition-all duration-300 hover:scale-[1.02]">
            <label className="block text-sm font-medium text-text-primary mb-1">
              目标电压 (V)
            </label>
            <input
              type="number"
              value={vout}
              onChange={(e) => setVout(parseFloat(e.target.value))}
              className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-card text-text-primary shadow-sm hover:shadow-md transition-shadow duration-300"
              placeholder="例如: 3.3"
            />
          </div>
        </div>

        <button
          onClick={calculate}
          disabled={!isFormValid()}
          className={`w-full py-2 px-4 rounded-md text-text-primary font-medium transform transition-all duration-300 ${
            isFormValid()
              ? 'bg-primary hover:bg-secondary hover:scale-[1.02] hover:shadow-lg active:scale-[0.98]'
              : 'bg-gray-700 cursor-not-allowed'
          } shadow-md`}
        >
          计算推荐电阻组合
        </button>

        {results.length > 0 && (
          <div className="mt-8 space-y-4">
            <h2 className="text-xl font-semibold mb-4 text-text-primary">推荐电阻组合</h2>
            <div className="mb-4 p-4 bg-card rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 border border-border">
              <p className="text-text-primary">
                <span className="font-medium">输出电压计算公式：</span>
                <span className="text-primary">Vout = Vref × (1 + R2/R1)</span>
              </p>
              <p className="text-sm text-text-secondary mt-1">
                其中：Vref为参考电压，R1为上分压电阻，R2为下分压电阻
              </p>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {results.map((result, index) => (
                <div 
                  key={index} 
                  className={`p-4 bg-card rounded-lg transform transition-all duration-300 hover:scale-[1.02] hover:shadow-lg border ${
                    index === 0 
                      ? 'border-primary shadow-lg' 
                      : 'border-border hover:border-primary/30'
                  }`}
                >
                  <div className="space-y-2">
                    <p className="text-text-primary">
                      反馈电流: <span className="font-medium text-primary">{result.current.toFixed(1)} nA</span>
                    </p>
                    <p className="text-text-primary">
                      实际电压: <span className="font-medium text-primary">{result.actualVoltage.toFixed(3)} V</span>
                      <span className="text-sm text-text-secondary ml-2">
                        (误差: {(result.error * 1000).toFixed(1)} mV)
                      </span>
                    </p>
                    <p className="text-text-primary">
                      R1: <span className="font-medium text-primary">{result.r1.toFixed(2)} kΩ</span>
                    </p>
                    <p className="text-text-primary">
                      R2: <span className="font-medium text-primary">{result.r2.toFixed(2)} kΩ</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App 