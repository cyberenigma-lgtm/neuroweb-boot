# ⚖️ Terceros, Atribución y Licencias // Third-Party Notices & Licenses

Este proyecto (**NeuroWeb-Boot**) es una arquitectura de virtualización ligera y aceleración web concebida y desarrollada por **José Manuel Moreno Cano (Noxferion)**.

En estricto cumplimiento con la legislación internacional de propiedad intelectual y los principios de transparencia del software de código abierto, a continuación se desglosan las atribuciones, licencias y componentes de terceros integrados en este proyecto.

---

## 🏛️ Desglose de Propiedad y Componentes // Component Ownership Breakdown

| Componente / Módulo | Naturaleza / Rol | Titularidad / Autor | Licencia / Registro |
| :--- | :--- | :--- | :--- |
| **NeuroWeb-Boot SDK** (`NeuroWebBoot.js`) | Capa de abstracción, API y orquestación | José Manuel Moreno Cano (*Noxferion*) | **Safe Creative ID: `2611247743117`** |
| **MMIO LFB Bridge** (`v86-bochs-vga.js`) | Adaptador LFB VBE forzado a `0xFD000000` | José Manuel Moreno Cano (*Noxferion*) | **Safe Creative ID: `2611247743117`** (Obra Derivada) |
| **Canvas Throttling Pipeline** | Control de 30/60 FPS no bloqueante | José Manuel Moreno Cano (*Noxferion*) | **Safe Creative ID: `2611247743117`** |
| **COM1 Serial Telemetry Bridge** | Captura y streaming UART 16550 de Ring-0 | José Manuel Moreno Cano (*Noxferion*) | **Safe Creative ID: `2611247743117`** |
| **v86 Core Wasm & JS** (`libv86.mjs`, `v86.wasm`) | Motor de emulación CPU/MMU x86/x86_64 | Fabian Hemmer (copyleft/v86) | **BSD 2-Clause License** |
| **SeaBIOS ROM** (`seabios.bin`) | BIOS x86 libre para virtualización | Kevin O'Connor / SeaBIOS Team | **GNU LGPLv3** |
| **Bochs VGABIOS ROM** (`vgabios.bin`) | BIOS de vídeo para adaptador Bochs VBE | Volker Ruppert / Bochs Team | **GNU LGPLv2.1 / LGPLv3** |

---

## 📜 1. BSD 2-Clause License (v86 Core)

```text
Copyright (c) 2012-2024, Fabian Hemmer
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

1. Redistributions of source code must retain the above copyright notice, this
   list of conditions and the following disclaimer.

2. Redistributions in binary form must reproduce the above copyright notice,
   this list of conditions and the following disclaimer in the documentation
   and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR
ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
```

---

## 📜 2. GNU Lesser General Public License v3 (SeaBIOS & VGABIOS)

SeaBIOS and Bochs VGABIOS are free software libraries; you can redistribute them and/or modify them under the terms of the GNU Lesser General Public License as published by the Free Software Foundation; either version 3 of the License, or (at your option) any later version.

- SeaBIOS Project: https://www.seabios.org/
- Bochs VGABIOS Project: https://bochs.sourceforge.io/

---

## 🛡️ Declaración Legal de Obra Derivada // Derivative Work Declaration
Las modificaciones estructurales introducidas en los controladores de pantalla MMIO, las rutinas de adaptación del Linear Framebuffer de Multiboot, el módulo de temporización de blit y el SDK de integración constituyen aportaciones intelectuales originales de **José Manuel Moreno Cano**, registradas con fehaciencia digital ante **Safe Creative** bajo el asiento **`2611247743117`**, respetando escrupulosamente los términos de las licencias de origen.
