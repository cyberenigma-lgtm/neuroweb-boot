# 📜 Arquitectura Técnica e Invención: NeuroWeb-Boot Engine

**Autor & Arquitecto:** José Manuel Moreno Cano (*Noxferion*)  
**Sello de Autoridad:** `0x4A4D4D43` (*JMMC*)  
**Firma de Kernel Ring-0:** `0x4359454E`  
**Registro Safe Creative:** ID `2611247743117`  
**Ecosistema:** NEURO-OS Sovereign Operating System Architecture  
**Repositorio Oficial:** `https://github.com/cyberenigma-lgtm/neuroweb-boot`

---

## 1. Resumen de la Invención
**NeuroWeb-Boot** es un motor de ejecución y virtualización ligera sobre WebAssembly diseñado para cargar, inicializar y ejecutar imágenes de disco óptico ISO (`El Torito` / `Multiboot 1/2`) conteniendo kernels monolíticos bare-metal de 64 bits (`x86_64` Long Mode) directamente en entornos web sin dependencias de máquinas virtuales pesadas ni complementos de escritorio.

---

## 2. Retos de Ingeniería Resueltos y Aportaciones Propias

### A. Conciliación de Direcciones MMIO en Linear Framebuffer (LFB)
En plataformas de virtualización x86 sobre Wasm, la BIOS inicializa el dispositivo gráfico Bochs VBE asignando una dirección base PCI (BAR0) arbitraria (p. ej. `0xFC000000` / `4227858432`). Sin embargo, los kernels x86_64 configurados bajo especificaciones Multiboot acceden al framebuffer lineal en direcciones fijas reservadas en el mapa de memoria física (`0xFD000000` / `4244635648`).
* **Solución de NeuroWeb-Boot:** Se implementó una capa de mediación MMIO directa en `v86-bochs-vga.js` que fuerza el remapeo de memoria RAM MMIO (`mmio_ram_map`) hacia la dirección `4244635648`, asegurando que las operaciones vectoriales SIMD/SSE2 (`vga_blit_simd_sse2`) del kernel aterricen directamente en el buffer de píxeles emulado sin provocar fallos de página ni pérdida de fotogramas.

### B. Throttling de Blit No Bloqueante a 30/60 FPS
En monitores de alta frecuencia (144 Hz, 240 Hz), las llamadas síncronas de rasterizado (`ctx.putImageData`) de 3.68 MB por fotograma saturan el hilo de renderizado del navegador.
* **Solución de NeuroWeb-Boot:** Se introdujo un temporizador diferencial de alta precisión (`performance.now() - last_render < 32ms`) que descarta redibujados redundantes y elimina por completo los probes síncronos `getImageData`, liberando ciclos de CPU de WebAssembly para el cómputo de instrucciones de la CPU emulada.

### C. Telemetría Asíncrona COM1 UART 16550
El motor intercepta las interrupciones del puerto serie estándar `COM1` (`0x3F8`) del microkernel y las redirige en tiempo real hacia eventos JavaScript, proporcionando un canal de caja negra de depuración bidireccional accesible desde la interfaz web.

---

## 3. Hoja de Ruta de Soberanía Modular (Sovereignty Roadmap)
Para alcanzar el 100% de autoría nativa sin dependencias externas, el proyecto contempla:
1. **Fase 1 (Vigente):** Core de virtualización híbrido Wasm (licencia BSD-2) con capas propietarias de mediación MMIO LFB, telemetría COM1 y SDK `NeuroWebBoot` (Registrado en Safe Creative #`2611247743117`).
2. **Fase 2 (NeuroBIOS):** Desarrollo de una micro-ROM nativa propia escrita en UPL / Ensamblador x86_64 que sustituya por completo a SeaBIOS para saltar directamente a Long Mode sin pasos legacy.
3. **Fase 3 (NeuroGPU Wasm):** Driver de renderizado por software en Wasm nativo sin recurrir al estándar Bochs VBE.

---

## 4. Marco Legal y Propiedad Intelectual
El diseño arquitectónico, el código fuente del SDK, los algoritmos de remapeo MMIO y las adaptaciones de flujo gráfico son autoría original y exclusiva de **José Manuel Moreno Cano (JMMC)**, registrados fehacientemente ante **Safe Creative** con identificador **`2611247743117`**. Los componentes base de emulación se rigen por la licencia permisiva BSD-2-Clause detallada en `THIRD-PARTY-LICENSES.md`.
