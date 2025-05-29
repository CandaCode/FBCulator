// Utility calculation logic for the standalone HTML version


const inputs = document.querySelectorAll('input[type="number"]');
const calculateBtn = document.getElementById('calculate-btn');

function validateInputs() {
  const filled = Array.from(inputs).filter(i => i.value !== '').length >= 2;
  calculateBtn.disabled = !filled;
}

function calculate() {
  const vref = parseFloat(document.getElementById('vref').value);
  const vout = parseFloat(document.getElementById('vout').value);
  const r1 = parseFloat(document.getElementById('r1').value);
  const r2 = parseFloat(document.getElementById('r2').value);

  let resultR1 = r1;
  let resultR2 = r2;
  
  if (!isNaN(vref) && !isNaN(vout)) {
    if (isNaN(r1) && !isNaN(r2)) {
      resultR1 = (vout/vref - 1) * r2;
    } else if (!isNaN(r1) && isNaN(r2)) {
      resultR2 = r1 / (vout/vref - 1);
    }
  }

  const current = (!isNaN(resultR1) && !isNaN(resultR2)) 
    ? (vref / (resultR1 + resultR2) * 1000).toFixed(2)
    : '--';

  document.getElementById('current').textContent = `${current} mA`;
  document.getElementById('result-r1').textContent = 
    !isNaN(resultR1) ? `${resultR1.toFixed(2)} KΩ` : '--';
  document.getElementById('result-r2').textContent = 
    !isNaN(resultR2) ? `${resultR2.toFixed(2)} KΩ` : '--';
}

inputs.forEach(input => {
  input.addEventListener('input', validateInputs);
});

document.getElementById('calculate-btn').addEventListener('click', (e) => {
  e.preventDefault();
  calculate();
});

window.addEventListener("DOMContentLoaded", () => {
  // 创建计算器界面结构
  const app = document.getElementById('app');
  app.innerHTML = `
    <div class="container">
      <h1>分压计算器</h1>
      <div class="input-group">
        <div class="input-row">
          <div class="input-item">
            <input type="number" id="vref" step="0.1" placeholder="参考电压(V)">
            <span class="input-hint">基准电压值</span>
          </div>
          <div class="input-item">
            <input type="number" id="vout" step="0.1" placeholder="输出电压(V)">
            <span class="input-hint">目标输出电压</span>
          </div>
        </div>
        <div class="input-row">
          <div class="input-item">
            <input type="number" id="r1" placeholder="R1阻值(KΩ)">
            <span class="input-hint">留空自动计算</span>
          </div>
          <div class="input-item">
            <input type="number" id="r2" placeholder="R2阻值(KΩ)">
            <span class="input-hint">留空自动计算</span>
          </div>
        </div>
        <button id="calculate-btn" class="calculate-btn">开始计算</button>
      </div>
      <div class="result-card">
        <div class="result-row">
          <span>工作电流：</span>
          <span class="highlight" id="current">-- mA</span>
        </div>
        <div class="result-row">
          <span>推荐R1阻值：</span>
          <span class="highlight" id="result-r1">-- KΩ</span>
        </div>
        <div class="result-row">
          <span>推荐R2阻值：</span>
          <span class="highlight" id="result-r2">-- KΩ</span>
        </div>
      </div>
    </div>
  `;
});
