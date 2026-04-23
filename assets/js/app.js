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
  setupEasterEggs();
  if (document.body.classList.contains('interests-page')) {
    setupInterestsScrollEffects();
  }
  if (window.location.pathname.includes('education')) {
    setupEducationScrollEffects();
  }
  if (window.location.pathname.includes('projects')) {
    loadAllRepositories();
  }
});

async function loadAllRepositories() {
  const repoContainer = document.querySelector('.all-projects-grid');
  if (!repoContainer) return;

  const repos = [
    'iamdarshg/drone-v2',
    'iamdarshg/Code-SDR',
    'iamdarshg/research-paper',
    'iamdarshg/quantum-sim-python',
    'iamdarshg/Trading-Algo',
    'iamdarshg/better-ai',
    'iamdarshg/PyFoilOptimize',
    'iamdarshg/Nuclear_collision'
  ];

  repoContainer.innerHTML = '';

  // Use session storage to cache results and avoid rate limits
  const cachedRepos = sessionStorage.getItem('github_repos_cache');
  if (cachedRepos) {
    try {
      const results = JSON.parse(cachedRepos);
      renderRepos(results, repoContainer);
      return;
    } catch (e) {
      sessionStorage.removeItem('github_repos_cache');
    }
  }

  repoContainer.innerHTML = '<p style="grid-column: 1/-1; text-align: center; opacity: 0.6;">Initializing real-time repository feed...</p>';

  const results = [];

  // Fetch sequentially or in small batches to be more reliable
  for (const repoPath of repos) {
    try {
      const [repoRes, readmeRes] = await Promise.all([
        fetch(`https://api.github.com/repos/${repoPath}`),
        fetch(`https://api.github.com/repos/${repoPath}/readme`, {
          headers: { 'Accept': 'application/vnd.github.v3.raw' }
        })
      ]);

      if (!repoRes.ok) throw new Error(`Repo fetch failed: ${repoRes.status}`);

      const repo = await repoRes.json();
      let readme = "No README available.";
      if (readmeRes.ok) {
        readme = await readmeRes.text();
      }

      results.push({ repo, readme, path: repoPath });

      // Update UI incrementally
      renderRepos(results, repoContainer);
    } catch (error) {
      console.error(`Error loading repo ${repoPath}:`, error);
      // Continue to next repo even if one fails
    }
  }

  if (results.length > 0) {
    sessionStorage.setItem('github_repos_cache', JSON.stringify(results));
  } else {
    repoContainer.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #f87171;">Failed to load repository data. Please try again later.</p>';
  }
}

function truncateMarkdown(md, length = 200) {
  if (md.length <= length) return md;

  // Try to truncate at a space to avoid cutting words
  let truncated = md.substring(0, length);
  const lastSpace = truncated.lastIndexOf(' ');
  if (lastSpace > length * 0.8) {
    truncated = truncated.substring(0, lastSpace);
  }

  return truncated.trim() + '...';
}

function renderRepos(results, container) {
  container.innerHTML = '';
  results.forEach(({ repo, readme, path }) => {
    const card = document.createElement('article');
    card.className = 'project-card';
    card.onclick = () => openProjectDetail(path.split('/')[1]);

    const truncatedReadme = truncateMarkdown(readme, 200);
    const htmlReadme = marked.parse(truncatedReadme);

    card.innerHTML = `
      <div class="project-content compact-content">
        <div class="compact-header">
          <h4>${repo.name}</h4>
        </div>
        <div class="project-meta">
          <span>⭐ ${repo.stargazers_count}</span>
          <span>🍴 ${repo.forks_count}</span>
          <span>${repo.language || 'Documentation'}</span>
        </div>
        <div class="readme-preview-container">
          <div class="readme-content-inner">${htmlReadme}</div>
        </div>
        <div class="project-footer" style="margin-top: 12px;">
          <div class="project-links">
             <img src="https://img.shields.io/github/stars/${path}?style=flat-square&color=teal" alt="stars">
             <a href="${repo.html_url}" target="_blank" onclick="event.stopPropagation()">GitHub ↗</a>
          </div>
        </div>
      </div>
    `;
    container.appendChild(card);
  });
}

function setupEducationScrollEffects() {
  const items = document.querySelectorAll('.timeline-item');
  const observerOptions = {
    threshold: 0.5,
    rootMargin: "-10% 0% -10% 0%"
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      } else {
        entry.target.classList.remove('active');
      }
    });
  }, observerOptions);

  items.forEach(item => observer.observe(item));
}

function setupInterestsScrollEffects() {
  const sections = document.querySelectorAll('.blog-section');
  const navLinks = document.querySelectorAll('.interests-nav a');

  const observerOptions = {
    threshold: 0.6
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        updateInterestsStyle(id);

        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => observer.observe(section));
}

function updateInterestsStyle(sectionId) {
  const root = document.documentElement;
  const styles = {
    'gym': {
      bg: '#1a0b0b',
      text: '#f87171',
      font: 'var(--font-family-base)'
    },
    'swimming': {
      bg: '#081e26',
      text: '#38bdf8',
      font: 'var(--font-family-serif)'
    },
    'muns': {
      bg: '#130d24',
      text: '#a78bfa',
      font: 'var(--font-family-serif)'
    },
    'gaming': {
      bg: '#1a1408',
      text: '#fbbf24',
      font: 'var(--font-family-mono)'
    }
  };

  const style = styles[sectionId];
  if (style) {
    root.style.setProperty('--color-background', style.bg);
    root.style.setProperty('--color-primary', style.text);
    document.querySelector('.blog-post').style.fontFamily = style.font;
  }
}

const projectDetails = {
  'drone-v2': {
    title: 'Drone-v2: Autonomous Aircraft Platform',
    tag: 'Aerospace • RF • Embedded Systems',
    status: 'In Active Development',
    timeline: 'December 2024 – Q2 2026',
    github: 'https://github.com/iamdarshg/drone-v2',
    overview: 'Complete autonomous aircraft development from PCB design through firmware validation. Multi-layer hardware with integrated RF frontend, sensor fusion, and real-time control systems.',
    sections: [
      {
        title: 'Technical Architecture',
        content: `
          <ul>
            <li><strong>Hardware Platform:</strong> Custom multi-layer PCB with integrated power distribution, RF frontend, and precision analog interfaces</li>
            <li><strong>Sensor Integration:</strong> IMU (9-DOF), GPS module, barometric pressure sensor, all with dedicated signal conditioning</li>
            <li><strong>RF Design:</strong> Antenna geometry optimized and tested for telemetry, impedance-matched transmission lines</li>
            <li><strong>Power Management:</strong> Multi-rail regulation with protection circuitry and efficient switching converters</li>
          </ul>
        `
      },
      {
        title: 'Firmware Development',
        content: `
          <ul>
            <li><strong>Real-time OS:</strong> Pure C implementation with minimal middleware for predictable timing</li>
            <li><strong>Sensor Fusion:</strong> Kalman filter integration of IMU, GPS, and barometric data</li>
            <li><strong>Control Loops:</strong> PID controllers for stabilization with tuning framework</li>
            <li><strong>Telemetry System:</strong> Bidirectional communication protocol with ground station</li>
            <li><strong>Safety Features:</strong> Watchdog timers, failsafe modes, geofencing</li>
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
    status: 'Board Routing Stage',
    timeline: 'November 2025 – Q1 2026',
    github: 'https://github.com/iamdarshg/Code-SDR',
    overview: 'High-performance FPGA-accelerated SDR system covering 1 MHz to 10 GHz with real-time processing pipeline. Complete implementation from Verilog HDL through computer interface achieving 105 MSPS throughput with <10µs latency.',
    sections: [
      {
        title: 'FPGA Processing Pipeline',
        content: `
          <ul>
            <li><strong>Platform:</strong> LIF-MD6000-6UMG64I FPGA with 100% logic utilization (16,000 LE)</li>
            <li><strong>ADC Interface:</strong> AD9215BCPZ-105 (10-bit, 105 MSPS) with parallel data acquisition and overflow detection</li>
            <li><strong>Digital Downconversion:</strong> NCO mixing with CIC decimation filters for flexible IF processing</li>
            <li><strong>FFT Engine:</strong> 1024-point complex FFT with Hamming windowing for spectral analysis</li>
            <li><strong>Clock Domains:</strong> 100 MHz processing, 105 MHz ADC, 125 MHz Ethernet with synchronized cross-domain transfers</li>
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
  'research-paper': {
    title: 'Aircraft Diffusion CFD: Generative Aerodynamic Design',
    tag: 'Research • AI/ML • Computational Fluid Dynamics',
    status: 'Active Research',
    timeline: 'December 2025 – Ongoing',
    github: 'https://github.com/iamdarshg/research-paper',
    overview: 'GPU-accelerated generative design system combining diffusion models with lattice Boltzmann CFD. Progressive training pipeline automatically generates and optimizes aircraft structures for aerodynamic efficiency with structural connectivity constraints.',
    sections: [
      {
        title: 'Technical Approach',
        content: `
          <ul>
            <li><strong>Generative Model:</strong> Diffusion-based architecture with hierarchical representation for 3D volumetric structures</li>
            <li><strong>CFD Integration:</strong> GPU-accelerated Lattice Boltzmann Method (LBM) for real-time aerodynamic evaluation</li>
            <li><strong>Structural Constraints:</strong> Connectivity penalty ensures generated designs are physically viable and manufacturable</li>
            <li><strong>Progressive Training:</strong> Multi-resolution approach (16³ → 24³ → 32³) balances quality and computational efficiency</li>
          </ul>
        `
      },
      {
        title: 'Performance Characteristics',
        content: `
          <div class="stats-grid">
            <div class="stat-item">
              <div class="stat-label">Training Time</div>
              <div class="stat-value">14-18 hrs</div>
            </div>
            <div class="stat-item">
              <div class="stat-label">GPU Memory</div>
              <div class="stat-value">8-13 GB</div>
            </div>
            <div class="stat-item">
              <div class="stat-label">Grid Resolution</div>
              <div class="stat-value">32³ voxels</div>
            </div>
            <div class="stat-item">
              <div class="stat-label">CFD Simulation</div>
              <div class="stat-value">&lt;100 µs/step</div>
            </div>
          </div>
          <p style="margin-top:16px;">
            <strong>Hardware:</strong> RTX 3090 (24GB) or A100 (2-3x faster)<br>
            <strong>Optimization:</strong> Gradient checkpointing, sparse grids, memory-efficient training
          </p>
        `
      },
      {
        title: 'System Architecture',
        content: `
          <ul>
            <li><strong>Encoder-Decoder:</strong> U-Net style architecture with skip connections and attention mechanisms</li>
            <li><strong>Latent Space:</strong> 128-dimensional compressed representation for efficient generation</li>
            <li><strong>Diffusion Process:</strong> 100 timesteps forward, 250 sampling steps with classifier-free guidance</li>
            <li><strong>Loss Function:</strong> Combined reconstruction, connectivity penalty, and aerodynamic objective</li>
            <li><strong>CFD Solver:</strong> D3Q27 lattice with cascaded collision operator for accuracy and stability</li>
          </ul>
        `
      },
      {
        title: 'CLI Tool Features',
        content: `
          <ul>
            <li><strong>Training:</strong> Resume-capable with TensorBoard logging, automatic checkpointing, hyperparameter control</li>
            <li><strong>Generation:</strong> Batch design synthesis with configurable guidance scale and sampling resolution</li>
            <li><strong>Evaluation:</strong> CFD analysis of drag, lift, structural metrics with JSON export</li>
            <li><strong>Export:</strong> STL mesh generation with optional simplification for CAD/manufacturing</li>
            <li><strong>Monitoring:</strong> Real-time loss curves, learning rate schedule, design previews via TensorBoard</li>
          </ul>
        `
      },
      {
        title: 'Research Applications',
        content: `
          <ul>
            <li><strong>Design Exploration:</strong> Rapidly generate diverse aircraft configurations for parameter studies</li>
            <li><strong>Optimization:</strong> Automated search through design space for optimal aerodynamic performance</li>
            <li><strong>Constraint Satisfaction:</strong> Balance between performance metrics and structural requirements</li>
            <li><strong>Manufacturing Integration:</strong> Direct STL export enables rapid prototyping and wind tunnel testing</li>
          </ul>
        `
      },
      {
        title: 'Technology Stack',
        content: `
          <div class="tech-stack">
            <span class="tech-badge">PyTorch 2.0+</span>
            <span class="tech-badge">CUDA</span>
            <span class="tech-badge">NumPy/SciPy</span>
            <span class="tech-badge">TensorBoard</span>
            <span class="tech-badge">Trimesh</span>
            <span class="tech-badge">Scikit-image</span>
            <span class="tech-badge">CFD/LBM</span>
            <span class="tech-badge">Diffusion Models</span>
          </div>
        `
      }
    ]
  },
  'research-paper-2': {
    title: 'ML-Based Rapid RCS Estimation for UAV Stealth',
    tag: 'Research / ML Regression / Electromagnetic Simulation',
    status: 'Drafted Research',
    timeline: 'Research Paper - 2',
    document: 'https://docs.google.com/document/d/1HaOFb65H8sa6XP68lDQqKQvD1LLnsXuSL4ejdr_u0k8',
    overview: 'A research paper on using machine-learning regression models to estimate UAV radar cross-section from electromagnetic simulation data. The work positions ML as a rapid screening layer for stealth-design exploration, with full-wave simulation retained for final validation.',
    sections: [
      {
        title: 'Research Focus',
        content: `
          <ul>
            <li><strong>Core question:</strong> Can trained regressors estimate radar cross-section fast enough to support early-stage UAV stealth design?</li>
            <li><strong>Engineering framing:</strong> The paper treats ML as a practical surrogate for design exploration, not as a replacement for electromagnetic solvers.</li>
            <li><strong>RCS scope:</strong> Covers monostatic and bistatic RCS, aspect-angle effects, frequency dependence, polarization, geometry, and material influences.</li>
          </ul>
        `
      },
      {
        title: 'Dataset Strategy',
        content: `
          <ul>
            <li><strong>Geometry inputs:</strong> Fuselage length, wing span, wing sweep, nose radius, tail-fin angles, inlet geometry, and other 8-15 parameter design variables.</li>
            <li><strong>Radar settings:</strong> Frequency sweeps from 1-40 GHz, azimuth coverage from 0-360 degrees, elevation from -30 to +30 degrees, and HH/VV/HV polarization states.</li>
            <li><strong>Scale target:</strong> Minimum 5,000-10,000 samples for neural-network training, with larger simulation datasets improving generalization.</li>
          </ul>
        `
      },
      {
        title: 'Modeling Approaches',
        content: `
          <ul>
            <li><strong>Baselines:</strong> Support vector machines and random forests are discussed for smaller or medium-sized datasets.</li>
            <li><strong>Neural models:</strong> Dense neural networks, volumetric CNNs, recurrent models for frequency sweeps, and hybrid CNN-transformer architectures are compared.</li>
            <li><strong>Physics-informed direction:</strong> PINN-style losses are presented as a way to regularize predictions and improve sparse-data behavior when the physics residual is well matched.</li>
          </ul>
        `
      },
      {
        title: 'Evaluation Plan',
        content: `
          <div class="stats-grid">
            <div class="stat-item">
              <div class="stat-label">Split</div>
              <div class="stat-value">70/15/15</div>
            </div>
            <div class="stat-item">
              <div class="stat-label">Target RMSE</div>
              <div class="stat-value">0.5-2 dB</div>
            </div>
            <div class="stat-item">
              <div class="stat-label">Speedup</div>
              <div class="stat-value">50-100x</div>
            </div>
            <div class="stat-item">
              <div class="stat-label">Validation</div>
              <div class="stat-value">Full-wave EM</div>
            </div>
          </div>
        `
      },
      {
        title: 'Practical Roadmap',
        content: `
          <ul>
            <li><strong>Weeks 1-4:</strong> Build a parametric geometry set and generate 3,000-5,000 EM simulations.</li>
            <li><strong>Weeks 5-8:</strong> Train baseline DNNs, establish validation/test splits, and compare geometry-aware CNN variants if mesh or voxel inputs are available.</li>
            <li><strong>Weeks 9-12:</strong> Tune hyperparameters, run multi-objective optimization, and validate the top candidates with full-wave simulation.</li>
          </ul>
        `
      },
      {
        title: 'Tools Mentioned',
        content: `
          <div class="tech-stack">
            <span class="tech-badge">PyTorch</span>
            <span class="tech-badge">TensorFlow</span>
            <span class="tech-badge">JAX</span>
            <span class="tech-badge">CST Microwave Studio</span>
            <span class="tech-badge">HFSS</span>
            <span class="tech-badge">FEKO</span>
            <span class="tech-badge">gprMax</span>
            <span class="tech-badge">MEEP</span>
            <span class="tech-badge">FEniCS</span>
          </div>
        `
      }
    ]
  }
};

function openProjectDetail(projectId) {
  const details = projectDetails[projectId];
  
  const modal = document.getElementById('detail-modal');
  const body = document.getElementById('detail-body');
  
  if (details) {
    const detailSections = (details.sections || []).map(section => `
      <div class="detail-section">
        <h3>${section.title}</h3>
        ${section.content}
      </div>
    `).join('');

    const readmeSection = details.github ? `
      <div class="detail-section" id="readme-section">
        <h3>GitHub README</h3>
        <div id="readme-content" class="readme-content" style="font-size: 13px; opacity: 0.8; border: 1px solid var(--color-border); padding: 15px; border-radius: 8px; background: rgba(0,0,0,0.2);">
          Loading repository data...
        </div>
      </div>
    ` : '';

    const links = [
      details.github ? `<a href="${details.github}" target="_blank" rel="noopener noreferrer" style="font-size:14px;">View on GitHub -></a>` : '',
      details.document ? `<a href="${details.document}" target="_blank" rel="noopener noreferrer" style="font-size:14px;">Open source document -></a>` : ''
    ].filter(Boolean).join('');

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
        <p id="llm-summary">${details.overview}</p>
      </div>

      ${detailSections}
      ${readmeSection}

      <div class="detail-section">
        <div class="project-links">
          <a href="${details.github}" target="_blank" rel="noopener noreferrer" style="font-size:14px;">View on GitHub ↗</a>
        </div>
      </div>
    `;
    const featuredLinks = body.querySelector('.detail-section .project-links');
    if (featuredLinks) {
      featuredLinks.innerHTML = links;
    }
    if (details.github) {
      fetchRepoData(details.github, { preserveSummary: true });
    }
  } else {
    // For non-featured repos
    body.innerHTML = `
      <div class="detail-header">
        <h2>${projectId}</h2>
      </div>
      <div class="detail-section">
        <h3>Overview</h3>
        <p id="llm-summary"><em>Generating technical summary...</em></p>
      </div>
      <div class="detail-section" id="readme-section">
        <h3>GitHub README</h3>
        <div id="readme-content" class="readme-content" style="font-size: 13px; opacity: 0.8; border: 1px solid var(--color-border); padding: 15px; border-radius: 8px; background: rgba(0,0,0,0.2);">
          Loading repository data...
        </div>
      </div>
      <div class="detail-section">
        <div class="project-links">
          <a href="https://github.com/iamdarshg/${projectId}" target="_blank" rel="noopener noreferrer" style="font-size:14px;">View on GitHub ↗</a>
        </div>
      </div>
    `;
    fetchRepoData(projectId);
  }
  
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

async function fetchRepoData(githubUrlOrSlug, options = {}) {
  const repoPath = githubUrlOrSlug.includes('github.com')
    ? githubUrlOrSlug.replace('https://github.com/', '')
    : `iamdarshg/${githubUrlOrSlug}`;

  const readmeContainer = document.getElementById('readme-content');
  const summaryContainer = document.getElementById('llm-summary');

  try {
    const response = await fetch(`https://api.github.com/repos/${repoPath}/readme`, {
      headers: { 'Accept': 'application/vnd.github.v3.raw' }
    });
    const readmeText = await response.text();
    readmeContainer.innerHTML = marked.parse(readmeText);

    // Call Pollinations AI for summary
    const prompt = `Summarize this project README for a technical audience in 2-3 sentences. Be concise, punchy, and highlight the technical stack. README: ${readmeText.substring(0, 2000)}`;
    const aiResponse = await fetch(`https://text.pollinations.ai/${encodeURIComponent(prompt)}`);
    const summary = await aiResponse.text();
    if (!options.preserveSummary) {
      summaryContainer.innerText = summary;
    }

  } catch (error) {
    readmeContainer.innerHTML = "<em>Error loading README. Please check the link.</em>";
    if (!options.preserveSummary) {
      summaryContainer.innerText = "Technical summary unavailable.";
    }
  }
}

function closeProjectDetail(event) {
  if (event && event.target !== event.currentTarget) return;
  
  const modal = document.getElementById('detail-modal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

document.addEventListener('keydown', function(event) {
  if (event.key === 'Escape') {
    closeProjectDetail();
  }
});

function setupEasterEggs() {
  const technoTrigger = document.getElementById('technoblade-trigger');
  if (technoTrigger) {
    technoTrigger.addEventListener('click', () => {
      spawnCrownedPig();
      localStorage.setItem('technoblade_unlocked', 'true');
    });
  }

  const minecraftTrigger = document.getElementById('minecraft-trigger');
  if (minecraftTrigger) {
    minecraftTrigger.addEventListener('click', () => {
      triggerMinecraftEffect();
    });
  }

  // Check if eggs are unlocked and allow them on other pages
  if (localStorage.getItem('technoblade_unlocked') === 'true') {
    document.querySelectorAll('.technoblade-text').forEach(el => {
        el.addEventListener('click', spawnCrownedPig);
    });
  }
  if (localStorage.getItem('minecraft_unlocked') === 'true') {
    document.body.classList.add('minecraft-unlocked');
    document.querySelectorAll('.minecraft-text').forEach(el => {
        el.addEventListener('click', triggerMinecraftEffect);
    });
  }
}

function triggerMinecraftEffect() {
  createConfetti();
  document.body.classList.add('minecraft-unlocked');
  localStorage.setItem('minecraft_unlocked', 'true');
}

function spawnCrownedPig() {
    console.log('Spawning pig...');
    const pigCount = 5;
    for (let i = 0; i < pigCount; i++) {
        setTimeout(() => {
            const pig = document.createElement('div');
            // Technoblade pig tribute gif
            pig.innerHTML = `<img src="https://media.tenor.com/C7YIu5Aonj4AAAAM/technoblade-minecraft-movie.gif" style="width: 100px; height: auto;" alt="Techno Pig">`;
            pig.style.position = 'fixed';
            pig.style.bottom = (10 + Math.random() * 80) + '%';
            pig.style.left = '-150px';
            pig.style.zIndex = '10000';
            pig.style.transition = `transform ${4 + Math.random() * 2}s linear`;
            pig.style.pointerEvents = 'none';

            document.body.appendChild(pig);
            pig.offsetHeight;
            pig.style.transform = `translateX(${window.innerWidth + 300}px) rotate(${Math.random() * 20 - 10}deg)`;

            setTimeout(() => pig.remove(), 7000);
        }, i * 300);
    }
}

function createConfetti() {
    console.log('Creating confetti...');
    for (let i = 0; i < 100; i++) {
        const confetti = document.createElement('div');
        confetti.style.position = 'fixed';
        confetti.style.width = (Math.random() * 12 + 8) + 'px';
        confetti.style.height = (Math.random() * 12 + 8) + 'px';
        confetti.style.backgroundColor = ['#77DD77', '#897451', '#3C2D22', '#BDB76B', '#559955'][Math.floor(Math.random() * 5)];
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.top = '-20px';
        confetti.style.zIndex = '10000';
        confetti.style.opacity = Math.random();
        confetti.style.pointerEvents = 'none';
        confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';

        document.body.appendChild(confetti);

        const animation = confetti.animate([
            { transform: 'translateY(0) rotate(0)', opacity: 1 },
            { transform: `translateY(100vh) translateX(${Math.random() * 100 - 50}px) rotate(${Math.random() * 720}deg)`, opacity: 0 }
        ], {
            duration: Math.random() * 3000 + 2000,
            easing: 'cubic-bezier(0.25, 0.1, 0.25, 1)'
        });

        animation.onfinish = () => confetti.remove();
    }
}
