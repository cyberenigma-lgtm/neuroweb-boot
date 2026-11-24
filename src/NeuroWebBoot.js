/**
 * ============================================================================
 * NeuroWebBoot Engine (v1.0.0)
 * High-Performance x86_64 WebAssembly Bare-Metal OS Bootloader & VBE LFB Compositor
 *
 * Architecture & Author: José Manuel Moreno Cano (Noxferion)
 * Authority Signature: 0x4A4D4D43
 * Project: NEURO-OS Sovereign Ecosystem
 * Repository: https://github.com/cyberenigma-lgtm/neuroweb-boot
 * ============================================================================
 */

export class NeuroWebBoot {
    /**
     * @param {Object} config Configuration parameters for the bare-metal virtual machine
     * @param {string} config.isoUrl URL or path to the bootable ISO image (El Torito / Multiboot)
     * @param {HTMLElement|string} config.screenContainer DOM element or selector for rendering the display
     * @param {number} [config.memorySize=1073741824] Virtual RAM in bytes (Default: 1024 MB)
     * @param {string} [config.wasmPath="dist/v86.wasm"] Path to the x86_64 WebAssembly core
     * @param {string} [config.biosPath="dist/seabios.bin"] Path to SeaBIOS ROM
     * @param {string} [config.vgaBiosPath="dist/vgabios.bin"] Path to Bochs VBE VGA BIOS ROM
     * @param {boolean} [config.fastboot=true] Bypass slow BIOS POST checks for instant kernel boot
     * @param {boolean} [config.preserveAspectRatio=true] Preserve 16:9 / 4:3 native framebuffer aspect ratio
     * @param {number} [config.fpsLimit=30] Target compositor framerate limit
     * @param {Function} [config.onSerialData] Callback receiving live COM1 UART debug telemetry
     * @param {Function} [config.onScreenModeChange] Callback on VBE resolution change [width, height, bpp]
     * @param {Function} [config.onReady] Callback when Wasm core and BIOS are initialized
     * @param {Function} [config.onError] Callback on initialization or execution error
     */
    constructor(config = {}) {
        this.config = {
            isoUrl: config.isoUrl || null,
            screenContainer: typeof config.screenContainer === "string" 
                ? document.querySelector(config.screenContainer) 
                : config.screenContainer,
            memorySize: config.memorySize || 1024 * 1024 * 1024,
            wasmPath: config.wasmPath || "dist/v86.wasm",
            biosPath: config.biosPath || "dist/seabios.bin",
            vgaBiosPath: config.vgaBiosPath || "dist/vgabios.bin",
            fastboot: config.fastboot !== false,
            preserveAspectRatio: config.preserveAspectRatio !== false,
            fpsLimit: config.fpsLimit || 30,
            onSerialData: config.onSerialData || null,
            onScreenModeChange: config.onScreenModeChange || null,
            onReady: config.onReady || null,
            onError: config.onError || null
        };

        this.emulator = null;
        this.isRunning = false;
        this.lastRenderTime = 0;
        this.frameInterval = 1000 / this.config.fpsLimit;
    }

    /**
     * Asynchronously boots the raw ISO bare-metal kernel inside the WebAssembly container
     */
    async boot() {
        if (!this.config.isoUrl) {
            const err = new Error("NeuroWebBoot: No bootable ISO URL provided in configuration.");
            if (this.config.onError) this.config.onError(err);
            throw err;
        }

        if (!this.config.screenContainer) {
            const err = new Error("NeuroWebBoot: Screen container DOM element not found.");
            if (this.config.onError) this.config.onError(err);
            throw err;
        }

        try {
            // Dynamically import the Wasm core module
            const { V86Starter } = await import("./libv86.mjs");

            const vmOptions = {
                wasm_path: this.config.wasmPath,
                memory_size: this.config.memorySize,
                bios: { url: this.config.biosPath },
                vga_bios: { url: this.config.vgaBiosPath },
                cdrom: { url: this.config.isoUrl },
                screen_container: this.config.screenContainer,
                autostart: true,
                fastboot: this.config.fastboot,
                preserve_aspect_ratio: this.config.preserveAspectRatio
            };

            this.emulator = new V86Starter(vmOptions);

            // Hook COM1 serial telemetry
            if (typeof this.config.onSerialData === "function") {
                this.emulator.add_listener("serial0-output-char", (char) => {
                    this.config.onSerialData(char);
                });
            }

            // Hook VBE screen mode switch
            this.emulator.add_listener("screen-set-mode", (isGraphical) => {
                const screen = this.emulator.v86.cpu.devices.vga;
                if (screen && typeof this.config.onScreenModeChange === "function") {
                    this.config.onScreenModeChange({
                        graphical: isGraphical,
                        width: screen.screen_width || 1280,
                        height: screen.screen_height || 720,
                        bpp: screen.bpp || 32
                    });
                }
            });

            this.emulator.add_listener("emulator-ready", () => {
                this.isRunning = true;
                if (typeof this.config.onReady === "function") {
                    this.config.onReady(this);
                }
            });

            return this;
        } catch (error) {
            if (typeof this.config.onError === "function") {
                this.config.onError(error);
            }
            throw error;
        }
    }

    /**
     * Sends hardware reset signal to CPU and SeaBIOS
     */
    reboot() {
        if (this.emulator) {
            this.emulator.restart();
        }
    }

    /**
     * Pauses the WebAssembly CPU execution loop
     */
    pause() {
        if (this.emulator && this.isRunning) {
            this.emulator.stop();
            this.isRunning = false;
        }
    }

    /**
     * Resumes the WebAssembly CPU execution loop
     */
    resume() {
        if (this.emulator && !this.isRunning) {
            this.emulator.run();
            this.isRunning = true;
        }
    }

    /**
     * Gracefully stops CPU and frees GPU / Canvas resources
     */
    destroy() {
        if (this.emulator) {
            this.emulator.destroy();
            this.emulator = null;
            this.isRunning = false;
        }
    }

    /**
     * Requests fullscreen on the screen container
     */
    fullscreen() {
        if (this.config.screenContainer) {
            if (this.config.screenContainer.requestFullscreen) {
                this.config.screenContainer.requestFullscreen();
            } else if (this.config.screenContainer.webkitRequestFullscreen) {
                this.config.screenContainer.webkitRequestFullscreen();
            }
        }
    }
}

if (typeof window !== "undefined") {
    window.NeuroWebBoot = NeuroWebBoot;
}

