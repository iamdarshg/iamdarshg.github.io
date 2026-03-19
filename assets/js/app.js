function initTheme() {
  const htmlElement = document.documentElement;
  const savedTheme = localStorage.getItem('theme') || 'dark';
  htmlElement.setAttribute('data-color-scheme', savedTheme);
}

function toggleTheme() {
  const htmlElement = document.documentElement;
  const currentTheme = htmlElement.getAttribute('data-color-scheme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  htmlElement.setAttribute('data-color-scheme', newTheme);
  localStorage.setItem('theme', newTheme);
}

function setupSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href').slice(1);
      if (!targetId) return;
      const target = document.getElementById(targetId);
      if (target) {
        e.preventDefault();
        window.scrollTo({
          top: target.getBoundingClientRect().top + window.scrollY - 80,
          behavior: 'smooth'
        });
      }
    });
  });
}

window.addEventListener('DOMContentLoaded', function() {
  initTheme();
  setupSmoothScroll();
  document.getElementById('year').textContent = new Date().getFullYear();
});

const projectDetails = {
  'drone-v2': {
    title: 'Drone-v2: Autonomous Aircraft Platform',
    tag: 'Aerospace • RF • Embedded Systems',
    status: 'Active Development',
    timeline: 'December 2024 – Present',
    github: 'https://github.com/iamdarshg/drone-v2',
    overview: 'High-performance autonomous aircraft platform featuring custom multi-layer PCB design and integrated RF systems. Research conducted at ASDL focused on trade studies and payload integration.',
    sections: [
      {
        title: 'ASDL Research & Architecture',
        content: `
          <ul>
            <li><strong>Trade Studies:</strong> Conducted system-level trade studies for various VTOL and fixed-wing configurations</li>
            <li><strong>Hardware Platform:</strong> Custom 4-layer PCB with integrated power distribution and RF frontends</li>
            <li><strong>Sensor Fusion:</strong> Extended Kalman Filter (EKF) implementation for high-fidelity state estimation</li>
            <li><strong>RF Design:</strong> Optimized antenna placement and impedance matching for long-range MAVLink telemetry</li>
          </ul>
        `
      },
      {
        title: 'Firmware & Control',
        content: `
          <ul>
            <li><strong>Real-time Control:</strong> C implementation of nested PID loops for attitude and position control</li>
            <li><strong>Communication:</strong> High-bandwidth MAVLink integration for real-time telemetry and command</li>
            <li><strong>Payload System:</strong> Modular interface for secondary sensor arrays and onboard computing (Raspberry Pi/Jetson)</li>
            <li><strong>Safety Systems:</strong> Multi-layer failsafe logic for battery, link loss, and geofence violations</li>
          </ul>
        `
      },
      {
        title: 'Development Lifecycle',
        content: `
          <ul>
            <li><strong>Schematic Design:</strong> Complete electrical design with component selection and verification</li>
            <li><strong>PCB Layout:</strong> Multi-layer routing with controlled impedance and thermal management</li>
            <li><strong>Manufacturing:</strong> Gerber file generation, DRC/ERC validation, fabrication specifications</li>
            <li><strong>Bring-up Testing:</strong> Systematic validation of power rails, communication buses, sensor interfaces</li>
            <li><strong>Hardware Iteration:</strong> V1 archived with documented improvements incorporated into V2</li>
          </ul>
        `
      },
      {
        title: 'Technology Stack',
        content: `
          <div class="tech-stack">
            <span class="tech-badge">C (Firmware)</span>
            <span class="tech-badge">Python (Ground Station)</span>
            <span class="tech-badge">KiCad (PCB Design)</span>
            <span class="tech-badge">STM32/ARM Cortex</span>
            <span class="tech-badge">RF Design</span>
            <span class="tech-badge">Real-time Systems</span>
          </div>
        `
      },
      {
        title: 'Current Progress',
        content: `
          <div class="stats-grid">
            <div class="stat-item">
              <div class="stat-label">Hardware</div>
              <div class="stat-value">V2 Layout</div>
            </div>
            <div class="stat-item">
              <div class="stat-label">Firmware</div>
              <div class="stat-value">Active Dev</div>
            </div>
            <div class="stat-item">
              <div class="stat-label">Testing</div>
              <div class="stat-value">In Progress</div>
            </div>
            <div class="stat-item">
              <div class="stat-label">Repository</div>
              <div class="stat-value">1 Star</div>
            </div>
          </div>
        `
      }
    ]
  },
  'code-sdr': {
    title: 'Code-SDR: Ultra-Wideband Software Defined Radio',
    tag: 'FPGA • RF • Digital Signal Processing',
    status: 'Active Research',
    timeline: 'November 2024 – Present',
    github: 'https://github.com/iamdarshg/Code-SDR',
    overview: 'FPGA-accelerated SDR with real-time DSP pipeline. SSDL research project focusing on receiver architecture and satellite power system telemetry simulation.',
    sections: [
      {
        title: 'MATLAB/Simulink Modeling',
        content: `
          <ul>
            <li><strong>System Simulation:</strong> Modeled the entire receiver chain from RF frontend to baseband DSP in MATLAB/Simulink</li>
            <li><strong>Signal Integrity:</strong> Analyzed noise figures and BER across various modulation schemes (BPSK, QPSK)</li>
            <li><strong>SSDL Integration:</strong> Developed telemetry processing models for satellite power system monitoring</li>
          </ul>
        `
      },
      {
        title: 'FPGA Implementation',
        content: `
          <ul>
            <li><strong>RTL Design:</strong> Verilog HDL implementation of high-speed ADC interfaces and decimation filters</li>
            <li><strong>DSP Pipeline:</strong> Real-time FFT and NCO mixing achieving 105 MSPS throughput</li>
            <li><strong>Hardware:</strong> Lattice iCE40/LIF-MD6000 based processing board with custom RF frontend</li>
          </ul>
        `
      },
      {
        title: 'Performance Specifications',
        content: `
          <div class="stats-grid">
            <div class="stat-item">
              <div class="stat-label">Sample Rate</div>
              <div class="stat-value">105 MSPS</div>
            </div>
            <div class="stat-item">
              <div class="stat-label">Processing Latency</div>
              <div class="stat-value">&lt;10 µs</div>
            </div>
            <div class="stat-item">
              <div class="stat-label">Ethernet Throughput</div>
              <div class="stat-value">750 Mbps</div>
            </div>
            <div class="stat-item">
              <div class="stat-label">FFT Resolution</div>
              <div class="stat-value">1024-point</div>
            </div>
          </div>
          <p style="margin-top:16px;">
            <strong>DC Offset Improvement:</strong> 43.54 dB (217% of requirement)<br>
            <strong>Processing Power:</strong> 100x improvement over legacy dsPIC33 architecture
          </p>
        `
      },
      {
        title: 'System Architecture',
        content: `
          <ul>
            <li><strong>Dual Streaming Modes:</strong> Processed FFT output (750 Mbps) or direct ADC streaming (950 Mbps)</li>
            <li><strong>Bandwidth Management:</strong> Intelligent limiting to 80% capacity (760 Mbps) prevents packet loss</li>
            <li><strong>Network Stack:</strong> Complete UDP/IP implementation with MAC layer on Gigabit Ethernet</li>
            <li><strong>RP2040 Control:</strong> SPI interface for configuration, gain control, and system management</li>
            <li><strong>Memory Architecture:</strong> Ping-pong buffers (32 M4K blocks) enable continuous streaming</li>
          </ul>
        `
      },
      {
        title: 'Software Integration',
        content: `
          <ul>
            <li><strong>GNU Radio Module:</strong> 85% complete - Out-of-tree module with source/sink blocks</li>
            <li><strong>Windows ExtIO Plugin:</strong> 80% complete - HDSDR and SDR# compatibility</li>
            <li><strong>Python API:</strong> Production-ready driver with NumPy/SciPy processing pipeline</li>
            <li><strong>Data Recording:</strong> Professional-grade system with >500K samples/second write speed</li>
            <li><strong>Calibration Suite:</strong> Automated DC offset correction, frequency calibration (<0.1 ppm)</li>
          </ul>
        `
      },
      {
        title: 'Hardware Implementation',
        content: `
          <ul>
            <li><strong>RF Frontend:</strong> Dual TX or TX/RX signal chain with mixers, LO planning, IF/baseband stages</li>
            <li><strong>PCB Design:</strong> Multi-layer with RF layout best practices, controlled impedance, EMI/EMC considerations</li>
            <li><strong>Signal Integrity:</strong> High-speed digital design, impedance matching, crosstalk mitigation</li>
            <li><strong>Power Management:</strong> Multi-rail with thermal design for sustained 105 MSPS operation</li>
          </ul>
        `
      },
      {
        title: 'Technology Stack',
        content: `
          <div class="tech-stack">
            <span class="tech-badge">Verilog HDL</span>
            <span class="tech-badge">FPGA (LIF-MD6000)</span>
            <span class="tech-badge">Python/NumPy</span>
            <span class="tech-badge">GNU Radio</span>
            <span class="tech-badge">C++ (Plugins)</span>
            <span class="tech-badge">DSP</span>
            <span class="tech-badge">Gigabit Ethernet</span>
            <span class="tech-badge">RF Design</span>
          </div>
        `
      }
    ]
  },
  'custom-bms': {
    title: 'Custom 6S Battery Management System (BMS)',
    tag: 'Power Electronics • Embedded Systems • KiCAD',
    status: 'Prototype Complete',
    timeline: '2024',
    github: 'https://github.com/iamdarshg',
    overview: 'A high-performance 6S BMS designed for UAV applications, featuring precise cell balancing, over-current protection, and real-time state-of-charge (SoC) estimation.',
    sections: [
      {
        title: 'Hardware Design (KiCAD)',
        content: `
          <ul>
            <li><strong>PCB Layout:</strong> Designed multi-layer PCB for 60A continuous current with optimized thermal paths</li>
            <li><strong>Protection:</strong> Integrated hardware-level OVP, UVP, and short-circuit protection</li>
            <li><strong>AFE:</strong> High-precision Analog Front-End (BQ76930) for cell-level monitoring</li>
          </ul>
        `
      },
      {
        title: 'Embedded Firmware',
        content: `
          <ul>
            <li><strong>Microcontroller:</strong> STM32-based controller for system management and communication</li>
            <li><strong>Algorithms:</strong> Real-time SoC estimation using Extended Kalman Filters (EKF)</li>
            <li><strong>Communication:</strong> SMBus/I2C interface for telemetry data output to flight controllers</li>
          </ul>
        `
      },
      {
        title: 'Performance Characteristics',
        content: `
          <div class="stats-grid">
            <div class="stat-item">
              <div class="stat-label">Max Current</div>
              <div class="stat-value">60A Cont.</div>
            </div>
            <div class="stat-item">
              <div class="stat-label">Voltage Accuracy</div>
              <div class="stat-value">±10 mV</div>
            </div>
            <div class="stat-item">
              <div class="stat-label">Balancing Current</div>
              <div class="stat-value">100 mA</div>
            </div>
            <div class="stat-item">
              <div class="stat-label">Sample Rate</div>
              <div class="stat-value">1 kHz</div>
            </div>
          </div>
        `
      },
      {
        title: 'Technology Stack',
        content: `
          <div class="tech-stack">
            <span class="tech-badge">KiCAD</span>
            <span class="tech-badge">C++ (STM32)</span>
            <span class="tech-badge">I2C/SMBus</span>
            <span class="tech-badge">Power Electronics</span>
            <span class="tech-badge">Kalman Filters</span>
          </div>
        `
      }
    ]
  }
};

function openProjectDetail(projectId) {
  const details = projectDetails[projectId];
  if (!details) return;
  
  const modal = document.getElementById('detail-modal');
  const body = document.getElementById('detail-body');
  
  let sectionsHTML = '';
  details.sections.forEach(section => {
    sectionsHTML += `
      <div class="detail-section">
        <h3>${section.title}</h3>
        ${section.content}
      </div>
    `;
  });
  
  body.innerHTML = `
    <div class="detail-header">
      <h2>${details.title}</h2>
      <span class="project-tag">${details.tag}</span>
      <div class="project-meta" style="margin-top:12px;">
        <span>${details.timeline}</span>
        <span class="badge-status badge-status--active">${details.status}</span>
      </div>
    </div>
    
    <div class="detail-section">
      <h3>Overview</h3>
      <p>${details.overview}</p>
    </div>
    
    ${sectionsHTML}
    
    <div class="detail-section">
      <div class="project-links">
        <a href="${details.github}" target="_blank" rel="noopener noreferrer" style="font-size:14px;">View on GitHub ↗</a>
      </div>
    </div>
  `;
  
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeProjectDetail(event) {
  if (event && event.target !== event.currentTarget) return;
  
  const modal = document.getElementById('detail-modal');
  modal.classList.remove('active');
  document.body.style.overflow = '';
}

document.addEventListener('keydown', function(event) {
  if (event.key === 'Escape') {
    closeProjectDetail();
  }
});
