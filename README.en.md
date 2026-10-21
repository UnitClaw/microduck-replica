# Microduck Replica

**English** · [简体中文](README.md)

> A third-party reconstruction study of [Pollen Robotics' Microduck](https://pollen-robotics.com/microduck/).
> Assembly drawings, exploded views, CAD-importable assemblies, and a complete
> electronics teardown — all derived from publicly released files and source code.

Microduck is a 25 cm, 737 g bipedal robot duck driven by 15 Dynamixel XL330 servos
(14 under policy control) that learns to walk with reinforcement learning.

Its **software is open source (Apache-2.0)**. Its hardware is **partly** open:

- ✅ **The RPI Robot HAT board is fully published** — [`pollen-robotics/elec_RPI_Robot_HAT`](https://github.com/pollen-robotics/elec_RPI_Robot_HAT)
  (Apache-2.0): KiCad 9 project, Gerbers, BOM, pick-and-place and STEP. **You do not need to redraw this board.**
- ❌ **The `imu_to_dxl` board is not published** — no public project exists anywhere; the reconstruction
  in this repo is the only one available.
- ❌ **No editable mechanical CAD**, no whole-robot BOM, no assembly documentation. Pollen Robotics
  [told the press not to call it "open-source hardware" (for now)](docs/社区动态.md).

> 📌 **Correction (2026-09-03)**: this document previously stated "its hardware is not [open], no PCB
> schematics". **That was wrong** — it searched only `pollen-robotics/microduck` and missed the
> organisation's `elec_`-prefixed hardware repositories.

But two public artifacts turn out to be enough:

1. **`microduck_rl` ships the full MJCF model and 47 STL meshes.** The MJCF contains the
   complete kinematic tree — which part mounts to which, relative positions accurate to
   0.1 mm, joint axes, travel limits, masses and inertia tensors.
2. **The Rust runtime is open source, and a runtime that drives real hardware must
   hard-code device paths, I²C addresses, register offsets, baud rates and protocols.**
   The code *is* the datasheet.

This repository is what falls out of reading both.

> ✅ **Independently verified.** On 2026-08-31, [@tspy](https://x.com/tspy/status/2094249218735300630)
> published a hardware teardown on X (169 likes) that matches this repository's
> conclusions exactly — including the critical one: **the main board is a Radxa Zero 3W**.
> Two independent paths, one answer. See [Community Intelligence](docs/社区动态.md).

---

> **Models and print files: [microduck-replica-cad](https://github.com/UnitClaw/microduck-replica-cad).** Select the Feetech or XL330 version there. Outdated printable STLs have been removed from this repository.

> **Assembly videos: [the "MicroDuck from scratch" series on Bilibili](https://space.bilibili.com/312747174/lists/9279084?type=season)** (Chinese narration). One subassembly per episode; 6 of 8 out → [episode list](#-assembly-videos)

## Two tracks — pick one

This repository covers two servo choices. **Mechanics, electronics and software all differ**, so decide before building:

| | Original · Dynamixel XL330 | Feetech · HD-1910 |
|---|---|---|
| **Servos** | XL330-M288-T ×15 | HD-1910-C001 ×15 — half the price, 2.5× the torque |
| **Voltage** | rated 6 V, run at 6.6–8.2 V, **37% over** | rated 4–8.4 V, within spec; a full pack sits at the 8.4 V ceiling |
| **Printed parts** | [CAD repository · XL330](https://github.com/UnitClaw/microduck-replica-cad) | [CAD repository · Feetech](https://github.com/UnitClaw/microduck-replica-cad); mating parts are not interchangeable |
| **Editable CAD** | [CAD repo v1.1](https://github.com/fanhao375/microduck-replica-cad/releases/tag/v1.1) | [CAD repo v2.1](https://github.com/fanhao375/microduck-replica-cad/releases/tag/v2.1), files carry an `-FT` suffix |
| **Electronics** | official HAT + [`imu_to_dxl`](hardware/imu_to_dxl/) | same; servo connectors are 2.0 mm (official 2.5), `imu_to_dxl` has J4/J5 at 2.0 |
| **Software** | official runtime runs as-is | different bus protocol, swap the protocol module — [adaptation architecture](software/飞特适配架构.md) (zh); policy retrained for HD-1910 — [training data checklist](docs/HD-1910训练前数据清单.md) |
| **Status** | paper analysis + first prints | Assembled and stood up (09-18); Armbian + HAT read all 14 joints during a 3,000-round pose-holding window at about 46.87 Hz with no missing responses. Mouth ID 29 excluded at the operator's request and unverified. Camera capture verified only on official B1; Armbian retest pending |

The selection argument is in [Actuator Selection](docs/actuator-selection.en.md). This repo's main line is Feetech; the original track is documented just as fully.

---

## 📺 Assembly videos

**[Bilibili series "MicroDuck 从零安装教程" (assembly from scratch)](https://space.bilibili.com/312747174/lists/9279084?type=season)** — starts from the parts list and builds one subassembly per episode. Narration is in Chinese, but the hands-on footage is easy to follow. 6 of 8 episodes are out as of 2026-10-12:

| Episode | Content | Length |
|---|---|---|
| [1](https://www.bilibili.com/video/BV1RoHX68EFV/) | Parts list: head, neck, both legs, feet and servo hardware | 1:32 |
| [2](https://www.bilibili.com/video/BV1Xppb6tECr/) | Lower legs | 2:21 |
| [3](https://www.bilibili.com/video/BV1ycpb6yEwB/) | Thighs | 5:13 |
| [4](https://www.bilibili.com/video/BV1Kwpg6wE9G/) | Torso | 2:29 |
| [5](https://www.bilibili.com/video/BV1EEpg6nEkD/) | Neck | 0:40 |
| [6](https://www.bilibili.com/video/BV1aKpE6hEzj/) | Head | 5:50 |

Get the printed and purchased parts from the assembly BOM in the [CAD repository](https://github.com/UnitClaw/microduck-replica-cad) before you start. Contact us:

<table align="center">
<tr>
<td align="center"><a href="https://www.wwntai.com"><b>Website</b></a><br><sub>www.wwntai.com</sub></td>
<td align="center"><a href="https://wwnt.ai"><b>International</b></a><br><sub>wwnt.ai</sub></td>
<td align="center"><a href="mailto:Support@wwntai.com"><b>Email</b></a><br><sub>Support@wwntai.com</sub></td>
</tr>
</table>

## Community

A WeChat group for people working on the same thing — build progress, pitfalls, sourcing.

The code below is for **Duck Replica Group 11** (WeChat disables QR joins once a group reaches 200 members).

<div align="center">
  <img src="assets/wechat-group-11.png" alt="Duck Replica Group 11 WeChat QR code" width="280">
  <br>
  <sub><b>Duck Replica Group 11 · expires 2026-10-29</b> — WeChat group codes are valid for 7 days<br>
  If it has expired, open an <a href="https://github.com/UnitClaw/microduck-replica/issues">issue</a> and I will post a fresh one</sub>
</div>

## Where things stand

The dated log is further down under [Latest](#latest).

<table>
<tr>
<td width="50%" valign="top">

### 🔌 Electronics · IMU fixed, it walks; three new boards drawn (2026-10)

<p align="center"><a href="assets/走路-2026-10-15.mp4"><img src="assets/走路-2026-10-15.gif" alt="2026-10-15: walking on a wooden floor after the IMU fix (click for the 5 s video)" width="220"></a></p>

It used to fall after two or three steps of pushing the stick; the cause was the BNO085's own fused orientation jumping while walking. With robotd carrying the attitude on the chip's own gyro, 60 s of pushing the stick gave no fall (kissqy V167 + our fork, default servo gains, silicone feet). Turning is still weak; we are on it. **[How it was found and fixed](docs/HD1910-20261015-IMU乱跳根因与陀螺融合上机.md)** (Chinese).

**New custom boards · three of them drawn (2026-10, not yet made or tested):** EasyEDA Pro projects and whole-board 3D models (for checking the fit against the frame) are in **[`hardware/新版/`](hardware/新版/)** (Chinese). Gerbers, BOMs and wiring tables are not out yet.

- **Bus IMU board v2**: the IMU board that sits on the servo bus (LSM6DSV16X + STM32G031), the old circuit laid out again; the servo connector is now an A2007WR-3P that takes the Feetech plug, the external crystal is gone, the bus series resistor is now 0 Ω, and firmware 0.2.0 runs unchanged. Routed; when it arrives, measure the bus low level first, and since the IMU chip is rotated 180° the mount has to be found again on the duck.
- **Servo bus hub**: battery in and bus split, connectors only (1.2 mm 3P ×2, 2.0 mm 3P right-angle and vertical ×2 each). Not made yet; the battery terminal CN1 is 8.4 mm tall and hits the frame, to be swapped for a low one.
- **Battery terminal board**: two banana sockets and two wire pads, 39 × 6.8 mm. Holes, pads and traces follow the reference board; not made yet.

The pinouts of the hub and the IMU board line up, so straight-through leads connect them.

**Earlier: first power-on, 09-18** ([30 s video](assets/首次上电-2026-09-18.mp4))

First time the assembled duck was on the bus: URT-2 over USB, 7.4 V into V1, **all 15 HD-1910 online, 0 timeouts, 0 checksum errors**, one sync_read of 15 servos in 4.8 ms.
Driven from the new [web servo console](tools/servo-web/) in this repo: sliders, saved poses, sequences, a 3D model that follows the real robot and a live centre-of-mass marker against the foot support.
In the video it stands up from the tucked pose **by itself**, then sits back down. **First step of the Feetech software path works**; the hardware plan holds.

The above is the 09-18 test. Earlier on 09-28, the failed ID 21 servo was replaced with the former mouth servo (ID 34), with centre calibration confirmed at 2048. The operator later assigned the mouth ID 29, whose firmware/model fields were detected during a scan. This test covers 14 joints; mouth ID 29 is excluded at the operator's request and remains unverified. The old “all 15 online” result is not the current acceptance result. Feetech-protocol [`imu_to_dxl` firmware 0.2.0](hardware/imu_to_dxl/firmware/) is available; physical bus testing is still pending.

**[Web servo console](tools/servo-web/)**　·　
**[Debug log](调试记录.md)** (zero pose, joint direction, stance pitfalls)　·　
[Pitfalls](踩坑记录.md#工具) (URT-2: USB first, then servo power)　·　
[Feetech adaptation architecture](software/飞特适配架构.md) (zh)

</td>
<td width="50%" valign="top">

### 🔨 Mechanical · Feetech HD-1910 build is assembled

<a href="BUILD-LOG.en.md"><img src="build-log/photos/2026-09-13-飞特版装机-正面.jpg" alt="Feetech HD-1910 build"></a>

**All 15 Feetech HD-1910 servos configured and mounted.** Not the official XL330 — half the
price, 2.5× the torque, running inside its rated voltage; the path argued in
[Actuator Selection](docs/actuator-selection.en.md), now physical.

**The HD-1910 horn protrudes where the XL330's is recessed**, so the 8 parts that mate with
horns were remodelled and reprinted. The editable SolidWorks drawings have an FT variant
(`-FT` suffix) with what changed and why.

**A from-scratch assembly video series** is in progress: [Bilibili series](https://space.bilibili.com/312747174/lists/9279084?type=season), up to episode 6 (head).

**[Assembly videos](#-assembly-videos)**　·
**[Build Log](BUILD-LOG.en.md)**　·
**[Feetech-variant SolidWorks drawings](https://github.com/UnitClaw/microduck-replica-cad)**　·
**[Models and print files](https://github.com/UnitClaw/microduck-replica-cad)**　·
[Debug Log](调试记录.md)　·
**[BOM with purchase links](https://github.com/UnitClaw/microduck-replica-cad#装配-bom)**　·
[Print downloads](print/)
</td>
</tr>
<tr>
<td width="50%" valign="top">

### 💻 Software · Studio web console + replica image (2026-10-20)

<p align="center"><a href="software/studio/"><img src="assets/studio-overview.png" alt="Microduck Studio overview: 3D duck, battery, servos, IMU, gamepad, board temperature and the getting-started checklist" width="420"></a></p>

**Microduck Studio: a web console that runs on the duck, written by us.** Open `http://<duck IP>:8000/` in a browser on a computer or phone to watch the robot, tune servos, pair a gamepad and make it walk — no SSH, no commands (the interface is in Chinese):

- **Overview**: a 3D duck that follows the real one; battery, servos, IMU, gamepad and board temperature at a glance; one-click relax at the top right (or the space bar);
- **Getting-started checklist**: servo zero → IMU mount → write into the main program → pair a gamepad → test the e-stop → stand up and take a few steps, telling you what to do next at each step;
- **Servos**: scan all 15, drag sliders, centre-calibrate one or all, direction, P / D / torque limit;
- **IMU**: a rough pass with the duck held in both hands, then a fine pass once it can stand, to work out how the IMU is mounted;
- **Write into the main program**: zeros, directions and the IMU mount go into the main program's calibration in one go, so the duck walks from the gamepad at boot without opening the page;
- **WiFi** (replica image only): when the duck finds no WiFi it opens its own hotspot; join it from a phone and enter your home WiFi at the top of the overview;
- **Gamepad**: Bluetooth pairing (through the official pairing path), an on-screen gamepad, e-stop test;
- **Remote**: stand up, walk, sit down, skills and moves;
- **Logs**: categorised and levelled; export a diagnostics bundle in one click to ask for help.

**Replica image (pre-release, real-duck test in progress)**: one card with everything — our fork of the main program, the walking and skill models, Studio, and a first boot that names the duck, finds the IMU and opens a hotspot for WiFi setup. Flash → boot → join the duck's `Microduck-xxxx` hotspot from a phone → enter your home WiFi in Studio → follow the checklist, no SSH at any point. The 10-21 build fixes what a fresh card turned up on a real duck: every checklist step can be skipped, skipping the IMU step still gets you into motion mode, the robot can stand in commissioning mode for the standing IMU check, Studio opens with Clash running, the page follows the duck to its new address after WiFi setup, and Studio's More page turns on SSH with a password you choose or a public key you register; the bus IMU may also be this repository's own imu_to_dxl board. The full run on our second duck is not finished yet, so it is out as a pre-release: **[download (Releases)](https://github.com/UnitClaw/microduck-replica/releases/tag/microduck-replica-image-20261021b)** · [flashing and first use](software/image/烧录和第一次使用.md) (Chinese). The image is free, for personal non-commercial builds only, and is not distributed with any paid product (the models in it are under their author's personal non-commercial licence).

**What has been tested**: Studio runs as a boot service on our second duck; gamepad pairing and the e-stop were tested on it. "Write into the main program", WiFi setup and the replica image have not been tested on a real duck yet; we are on it. Not done yet: editing the walking feel from the page.

The main program is our fork [fanhao375/Microduck-kissqy](https://github.com/fanhao375/Microduck-kissqy): an IMU module (BNO085 / LSM6DSV16X) goes straight onto the board's I²C with four wires — no bus IMU board to build — and integrating the gyro fixed the attitude jumps while walking. Studio is tested on it.

**[Studio](software/studio/)** (Chinese)　·
**[Replica image](software/image/)** (Chinese)　·
[Software overview](software/) (Chinese)　·
**[Installing it on the duck](software/studio/README.md#装到鸭子上)**　·
[Bench mode: tune servos with no main board](software/studio/README.md#台架模式主控没烧用飞特调试板在电脑上调舵机)　·
[IMU module wiring and install](https://github.com/fanhao375/Microduck-kissqy/blob/hd1910-v167-trunk-imu-i2c/IMU-MODULE.md)　·
[The older web console, servo-web](tools/servo-web/)　·
[Feetech official docs](docs/飞特资料/)

</td>
<td width="50%" valign="top">

### 🧠 Algorithms · servo parameters and training workflow

The Feetech simulation baseline adopts the **1910 BAM M6 actuator parameters published by
[LuwuDynamics/xgoduck_rl](https://github.com/LuwuDynamics/xgoduck_rl)**. Thank you to LuwuDynamics
for sharing them. These parameters were not independently identified by this replica project.
The [provenance record](docs/HD-1910-M6参数来源.md) includes the pinned source revision,
original-file checksum and Apache-2.0 license.

**Feetech has also published an HD-1910 BAM model:** [ftservo/ftservo-bam](https://gitee.com/ftservo/ftservo-bam)
(Gitee, Apache-2.0) with the manufacturer's own identified parameters and a dedicated controller model,
so the two sets can be compared. We have not yet verified which matches the real servo better; see the
[integration notes](docs/HD-1910-M6参数来源.md#飞特官方-hd-1910-bam) (Chinese).

**For the training workflow, we recommend [kissqy / Microduck-kissqy](https://github.com/kissqy/Microduck-kissqy)**. Thanks to [@kissqy](https://github.com/kissqy) for sharing!
The project provides an HD1910 training console and guides covering environment setup, training job management
and ONNX export, alongside a robot control console, firmware and demo videos.

The complete training project is included in **[`software/training/`](software/training/)**:
one clone includes the source, actuator parameters and simulation models. See the
[run guide and controller initialization fix](software/training/docs/hd1910-baseline.md).
Training builds on [Pollen Robotics/microduck_rl](https://github.com/pollen-robotics/microduck_rl)
and [Rhoban/BAM](https://github.com/Rhoban/bam). Integration tests and a short training check
have passed; there is no walking policy validated on this replica yet. Hardware testing still
needs joint calibration, IMU/runtime integration, and checks of actual mass/inertia and servo response.

**[HD-1910 pre-training data checklist](docs/HD-1910训练前数据清单.md)**　·　
[Actuator selection](docs/执行器选型.md)

</td>
</tr>
</table>

---

## 🔨 Build Progress

> This repository states repeatedly that simulation STLs are not manufacturing files.
> **The build log is the test of that claim.** The result gets recorded either way.

**→ [Build Log](BUILD-LOG.en.md)**

---

## 🦆 Contributions from the flock

This repo is not one person's work. Merged code and bench-verified findings are credited here.

> **Original authors**: this repo descends from [@fanhao375](https://github.com/fanhao375)'s [microduck-replica](https://github.com/fanhao375/microduck-replica) — the reverse-engineering study, assembly drawings, exploded views, hardware analysis and documentation were originally his work. The SolidWorks drawings, assembly BOM and assembly videos were modelled by **机械行者Robo**. This repo continues that work.

| Who | What they contributed |
|---|---|
| [@yoyojacky](https://github.com/yoyojacky) | **A Rust test tool for Feetech servos** ([PR #27](https://github.com/UnitClaw/microduck-replica/pull/27), merged). A minimal STS/SCS protocol implementation of his own (framing, checksum, ping, register read/write, status parsing). The CLI scans the bus with a progress bar, reads status, moves a servo to a position, and runs single or batch tests that report position error, peak current, peak load, voltage and temperature, with a PASS/FAIL verdict — one command gives you a bench acceptance table → [`tools/sts3215Servo_testtool/`](tools/sts3215Servo_testtool/) |
| [@Abo1ish](https://github.com/Abo1ish) | **IMU board firmware + attitude view in the debug console** ([PR #32](https://github.com/UnitClaw/microduck-replica/pull/32), merged). A base STM32G031 firmware for the imu_to_dxl board that Pollen never open-sourced, verified on real hardware, with host-side tests and a [`VALIDATION.md`](hardware/imu_to_dxl/firmware/VALIDATION.md) that is clear about its limits → [`hardware/imu_to_dxl/firmware/`](hardware/imu_to_dxl/firmware/). He also streams the IMU attitude over J-Link into the web debug console, so the 3D duck's body turns with the real board (`--imu-jlink`, or `--imu-demo` with no hardware) → [`tools/servo-web/`](tools/servo-web/) |
| A member of the WeChat group | **Boot recipe for the Radxa Zero 3W V1.12J.** On this batch (WiFi changed to AIC8800DS2), swapping in Radxa's bootloader is not enough. He found by testing that the device tree has to come from Radxa too: **B1 bootloader + B1 DTB + Armbian 6.1.115 kernel + Trixie userland**, and got it booting → written up in the [pitfalls log](踩坑记录.md#软件) and the [image guide](tools/radxa/镜像使用说明.md) (both Chinese) |

### Projects from the flock

Some people build duck-related things in their own repos. The good ones get a shout-out here:

| Project | Author | What it does |
|---|---|---|
| [microduck-color-studio](https://github.com/LathamZ/microduck-color-studio) ([live demo](https://lathamz.github.io/microduck-color-studio/)) | [@LathamZ](https://github.com/LathamZ) | **A 3D color studio for the duck: settle the colors in your browser before you print.** Color each of the 70 parts, pick a material (PLA / matte / PETG / metallic / carbon fiber / TPU) and lighting to preview. Enter the filaments you already own and it recommends palettes from your stock (use what you have / add one color / acrylic accents). You can also import your own 3MF (e.g. the Feetech version) and export a **colored multi-plate 3MF** plus per-part STLs, with presets for Bambu P1S / A1 mini / H2D. Chinese and English UI, works on mobile |
| [MICDUCK_FTHD1901_REBUILD](https://github.com/fengj4780-sudo/MICDUCK_FTHD1901_REBUILD) | [@fengj4780-sudo](https://github.com/fengj4780-sudo) | **Feetech-build structural rework with optional CNC reinforcement.** Builds on our [editable SolidWorks drawings](https://github.com/UnitClaw/microduck-replica-cad): adapted to the Feetech servo (written as HD1901 in that repo; the part files are HD-1910-C001), weak parts reinforced, assembly interferences fixed and some broken models repaired. **Five leg parts can be made as CNC parts** for better load paths (still being prototyped; the author estimates about ¥45 for all five including shipping); printing them instead also works and is stronger than the original. Includes a one-click 3MF (Bambu H2D, 0.4 mm, 5 plates) and the reworked SolidWorks drawings (Chinese) |
| [Microduck-kissqy](https://github.com/kissqy/Microduck-kissqy) | [@kissqy](https://github.com/kissqy) | **A reference for Feetech HD1910 training workflows and robot control.** Includes a training console, environment setup and job management guides, ONNX model export, a robot control console, firmware and demo videos. Recommended in the algorithms section for the practical training workflow |

Built something for the duck (a tool, tutorial, mod, policy…)? Open an issue with the link and we'll add it.

Want to join in: open an [issue](https://github.com/UnitClaw/microduck-replica/issues) or send a PR.
Hardware, firmware, algorithms, documentation, measured data — all of it counts. **Measured data especially**: the rule in this repo is that results get recorded honestly, positive or negative.

---

## Latest

**2026-10-20 — Replica image, first build (pre-release, real-duck test pending).** One card with everything (our fork of the main program, the walking and skill models, Studio, first boot and WiFi setup): flash it, boot, join the duck's hotspot from a phone, enter your home WiFi in Studio and follow the checklist, no SSH. After the first build we ran a three-way review and found that a fresh card cannot get through the "IMU mount" and "write into the main program" steps: out of the box the main program has to run in commissioning mode, and the image had it in motion mode. Fixed and rebuilt; it is out as a pre-release on [Releases](https://github.com/UnitClaw/microduck-replica/releases/tag/microduck-replica-image-20261020) and becomes a full release once it passes on a real duck. [Flashing and first use](software/image/烧录和第一次使用.md) · [image build scripts](software/image/) (Chinese).

**2026-10-20 — Three new custom boards drawn.** Bus IMU board v2 (its servo connector is now an A2007WR-3P that takes the Feetech plug), a servo bus hub and a battery terminal board; EasyEDA projects and 3D models are in [`hardware/新版/`](hardware/新版/) (Chinese). None has been made or tested yet.

**2026-10-20 — Microduck Studio, first release: a console in the browser.** A web console that runs on the duck, written by us. Open `http://<duck IP>:8000/` to watch the robot, relax it in one click, calibrate servo zeros, work out the IMU mount, write it into the main program, pair a Bluetooth gamepad, test the e-stop and make the duck stand up and walk, following a step-by-step checklist with no SSH. It already runs as a boot service on our second duck; gamepad pairing and the e-stop were tested on it. "Write into the main program" has not been tested on a real duck yet, and editing walking parameters from the page is not done yet. [Studio and how to install it](software/studio/) (Chinese).

**2026-10-15 evening — the cause of "falls after two or three steps" found; the duck now walks steadily:** the BNO085's own fused orientation jumps 20–60° within 20 ms while walking (mostly around foot strikes), while its gyro says the trunk turned 1–2°; the policy believes it is falling and its correction makes it fall. robotd can now carry the attitude with the chip's own gyro and only follows the chip slowly when the two agree. On the robot: in the old mode, 9 s of pushing the stick gave 2 falls; in the new mode, 60 s of pushing gave none, and 10+ minutes in walk mode (60 s of it pushing the stick) only one fall, while the chip still jumped 745 times — none of them reached the policy. No interleaved A/B was run (the user saw it on site and kept the new mode); turning is still weak and the board still reboots now and then. Code on the fork branch [`hd1910-v167-gyro-fusion`](https://github.com/fanhao375/Microduck-kissqy/tree/hd1910-v167-gyro-fusion) (the default is still the old mode; switching: [IMU-MODULE.md 4.4](https://github.com/fanhao375/Microduck-kissqy/blob/hd1910-v167-gyro-fusion/IMU-MODULE.md), Chinese). [Full record: symptom, strategy, analysis, fix, on-robot data](docs/HD1910-20261015-IMU乱跳根因与陀螺融合上机.md) (Chinese).

**2026-10-14 evening — IMU modules for kissqy's full stack (fork):** kissqy's one-click stack only reads the IMU board on the servo bus, so a duck with a ready-made IMU module cannot use it. We added "IMU module on the board's own I²C" (BNO085 / LSM6DSV16X) to his robotd and published it in our fork [fanhao375/Microduck-kissqy](https://github.com/fanhao375/Microduck-kissqy) (branch `hd1910-v167-trunk-imu-i2c`, on top of his 10-14 V167). **It is not an official kissqy release** — report problems here. BNO085 has run on our first robot (on V164); the V167 merge has only passed unit tests and **has not run on a robot yet**, nor has LSM6DSV16X. We test it on our robot tonight and will update this note. Wiring, build, the installer and confirming the IMU mount: [IMU-MODULE.md](https://github.com/fanhao375/Microduck-kissqy/blob/hd1910-v167-trunk-imu-i2c/IMU-MODULE.md). Also: kissqy's V167 "body jitter fix" writes servo D=0 and torque limit 1000 on every arm, matching our 10-13 finding; a duck with an IMU module **must not use "install/upgrade firmware" in his console**, which would remove the module support.

**2026-10-14 — Feetech's official HD-1910 BAM actuator model:** At the end of September Feetech published [ftservo/ftservo-bam](https://gitee.com/ftservo/ftservo-bam) on Gitee (Apache-2.0, a fork of Rhoban/BAM), with m1–m6 parameters for the HD-1910 identified at 7.4 V and a dedicated HD-1910 controller model. Until now everyone has trained with the 1910 M6 parameters published by LuwuDynamics; the manufacturer's own set is now available to compare. The two differ substantially (motor resistance: Feetech 2.97 Ω, LuwuDynamics 4.91 Ω; computed stall torque: Feetech 1.37, LuwuDynamics 0.91 N·m), and **we have not yet verified on hardware which one matches the real servo better**. Feetech's recording script sets P but not D, so the servos were most likely at the factory D=40 — confirm D before deploying a policy trained on it. Loading and gain-conversion details: [comparison and integration notes](docs/HD-1910-M6参数来源.md#飞特官方-hd-1910-bam) (Chinese).

**2026-10-13 night — Brownouts, servo D and foot scraping:** Both cards brown out while walking; the supply cannot hold the current spikes — it is not software. The walking jitter is linked to the servos' hardware D (damping): the actuator model used in training has no D term, and setting D=0 cut the high-frequency share of torso motion from 51% to 4–8%; we now run P3 / D0 / torque limit 700. The feet scrape because both lift only half as high as in simulation, and with D=0 the left toe also points down; next we try D=5–10. kissqy's one-click image (V164) does not write D or the torque limit, so changing them in the console has no effect. [Full record](docs/HD1910-20261013-夜-掉电-舵机D与蹭地.md) (Chinese) · [Where our software comes from and what we changed](docs/软件来源与我们的改动.md) (Chinese) · [Gait analysis scripts](tools/gait-analysis/).

**2026-10-12 night — IMU calibrated, first stable stand and alternating steps:** The reason the walking policy charged backwards and fell as soon as it took over was an **IMU module mounted about 8.5° off**. The policy was trained with a level torso at HOME, but the IMU kept reporting an 8.5° forward lean, so the policy kept "recovering" backwards. We computed the expected torso attitude from the real joint angles in simulation and folded the difference into the IMU mounting quaternion. Afterwards the policy held the robot upright for 70 s (mean tilt 0.2°), and pushing the stick produced alternating steps (forward distance not measured yet). The web gamepad lag was traced to four layers; a Bluetooth gamepad paired directly to the robot bypasses all of them. [Full log and the IMU zero-calibration method](docs/HD1910-20261012-夜-IMU校准与首次迈步.md) (Chinese) · [analysis scripts](tools/radxa/onboard-analysis/).

**2026-10-12 — Main board correction:** We previously recommended the Radxa Zero 3W "2 GB / 16 GB eMMC" SKU. **That was unnecessary and cost people money.** The official spec only says 1 GB RAM and 32 GB storage. Our first robot runs a 2 GB board **without eMMC** on a microSD card; with the full kissqy stack it uses 175 MB of RAM and 3.3 GB of storage. **A 1 GB or 2 GB board without eMMC plus a 32 GB microSD card is enough.** Buy from official distributors (ALLNET, Radxa's official stores) rather than resellers. A 2G/16G board you already bought works fine. See the [purchase guide](docs/电控采购清单.md#该买哪个配置) (Chinese).

**2026-10-12 — Assembly videos:** A from-scratch assembly series is available on Bilibili. Six of eight episodes are out: parts list, lower legs, thighs, torso, neck and head. See the [episode list](#-assembly-videos).

**2026-09-29 — Image login correction:** The original public image requires **`root / 1234`** for the first login. Complete the Armbian wizard before using `duck / duck1234`; it also changes the root password. Change both default passwords immediately. The old image still needs the `wlan0` DHCP fix. The [guide](tools/radxa/镜像使用说明.md) is corrected, and a separate DHCP fix candidate image was published at the time. (10-21: both September base images have been taken down from Releases; for a ready-made card use the [replica image](https://github.com/UnitClaw/microduck-replica/releases/latest).) It contains neither the robot runtime nor the web servo console.

**2026-09-28 — HAT feedback test:** Web console **0.15.4** is deployed on the board, with responses matched by their actual servo ID and a 50 Hz sampling target. While holding the existing pose for about 64 seconds, all 14 joints returned **3,000/3,000** valid samples (42,000 total), with no timeout, checksum or ID errors in that window. The observed rate was **46.87 Hz**. Torque remained enabled and goals/settings were unchanged. **The full control loop with IMU, inference and motion writes, and the walking policy, remain unverified.** Occasional missing responses have occurred outside this window. See the [test scope and results](tools/radxa/50Hz保持姿势读状态-20260928.md) (Chinese).

**2026-09-28 — HAT and camera bring-up:** The HAT has arrived and been fitted to the board. After the camera ribbon orientation/contact was corrected, the Radxa Camera 8M219 was identified and **40 frames at 1920×1080** were captured on official Bookworm B1. The next step is to return to the project Armbian image and repeat the test with the corrected wiring. Sustained frame rate, all HAT functions and robot walking remain unverified. See the [wiring reference and test record](tools/radxa/摄像头调试记录-20260928.md) (Chinese).

---

## Exploded Assembly View

![Exploded view](assembly-drawings/06_爆炸图_四分之三.png)

Seven drawings under `assembly-drawings/`:

| File | Contents |
|---|---|
| `01_正面` `02_侧面` `03_背面` `04_四分之三` | Front / side / rear / isometric, assembled, natural colors |
| **`05_爆炸图_侧面`** | 15 parts exploded along the kinematic chain, labeled with names and masses |
| **`06_爆炸图_四分之三`** | Isometric — shows the left/right leg mirroring clearly |
| `07_分色对照_装配态` | Assembled state in the same color coding, for cross-reference |

## Assembly Structure

```
Trunk 199 g
├─ L hip yaw→roll 23 g → L hip roll 6 g → L thigh 48 g → L shin 22 g → L ankle+foot 30 g
├─ Neck base 37 g → Neck pitch 6 g → Head yaw/roll 49 g → Head assembly + beak 189 g
└─ R hip yaw→roll 23 g → R hip roll 6 g → R thigh 48 g → R shin 22 g → R ankle+foot 30 g

Total 737.2 g   Envelope 144 × 141 × 264 mm
```

The trunk and the head weigh almost the same (199 g vs 189 g) — **the head is a quarter of
the whole robot and the center of mass sits high**, which explains why its walking policy
is hard to train.

## Joint Parameters

Five DoF per leg, four for neck and head — **14 under policy control**.
The robot actually carries **15 Dynamixel XL330**: the 15th drives the beak through a
passive linkage and never enters the action space.

| Joint | Travel |
|---|---|
| `hip_yaw` | −25° … +30° |
| `hip_roll` | ±22° |
| `hip_pitch` / `knee` / `ankle` / `head_pitch` | ±90° |
| `neck_pitch` | −90° … +60° |
| `head_yaw` | ±170° |
| `head_roll` | ±25° |

## 📋 Bill of Materials

**What to buy and how many** — [`BOM.en.md`](BOM.en.md)

15 servos, 14 bearings, ~325 fasteners, 2 boards to fabricate. Quantities are counted from geom
references in the upstream MJCF (38 mesh types / 75 instances), not estimated. Includes a per-board
parts list with LCSC numbers.

> ⚠️ Two corrections in there that stop you buying the wrong thing: **the battery is an NP-F550,
> not an F970**, and **the XL330 is run over-voltage**.

## Print files and CAD assemblies

**Download models from [UnitClaw/microduck-replica-cad](https://github.com/UnitClaw/microduck-replica-cad).** SolidWorks, STEP, print projects, assembly BOMs and installation instructions are maintained together there.

| Servo version | CAD release checked on 2026-09-28 |
|---|---|
| Feetech HD-1910 | [v2.1](https://github.com/fanhao375/microduck-replica-cad/releases/tag/v2.1) |
| Dynamixel XL330 | [v1.1](https://github.com/fanhao375/microduck-replica-cad/releases/tag/v1.1) |

The old `print/` parts and `cad/` assembly STLs came from upstream simulation geometry and did not include the physical CAD changes. Those files have been removed; the directories now contain download pointers. **Do not mix the two servo versions or print simulation/web-viewer meshes from this repository.**

The CAD repository's older 09-15 3MF does not include the v2.1 combined wheel. Check the attachment version; see [printing notes](print/README.en.md). CAD modelling and assembly documentation are by **机械行者Robo**, with attribution and licensing in the CAD repository. The [assembly videos](#-assembly-videos) walk through the build.

---

## Electronics, Reverse-Engineered from the Runtime

<div align="center">
  <img src="assets/hw/01-物理布局.png" alt="Microduck electronics overview: where each board sits" width="880">
  <br>
  <sub><b>Physical layout of the five modules.</b> Dashed grey = physical region, solid = module,
  dashed red = mounted <b>outside</b> the shell.<br>
  <b>Orange</b> is the servo bus (top-down), <b>red</b> is battery power (bottom-up).<br>
  The one thing people get wrong: <b>the compute board, the HAT and the camera are all in the head</b> —
  the camera sits ~13 mm from the board centre with no joint between them,<br>
  so the MIPI ribbon never crosses the neck. What does cross it is the servo bus and the power line.<br>
  <a href="docs/硬件入门.md">Full diagram set (Chinese) →</a>　·　<a href="assets/hw/Microduck硬件图集.pdf">Download PDF (7 diagrams, A3)</a></sub>
</div>


**One 1 Mbps TTL serial bus does everything.**

```
                Radxa Zero 3W (RK3566) · Armbian
                  ├── UART2  1 Mbps TTL half-duplex ── 15× XL330 + imu_to_dxl (ID 200)
                  ├── I2C3   400 kHz (pins 3/5) ────── AIC3104@0x18 · ToF@0x29 · BMI088 (unused)
                  ├── I2S3   12.288 MHz ────────────── audio
                  ├── MIPI CSI ─────────────────────── IMX219 (I2C@0x10, mounted upside down)
                  ├── Bluetooth ────────────────────── gamepad / phone app
                  ├── Wi-Fi ────────────────────────── WebRTC
                  └── USB-C ────────────────────────── power + maskrom
```

| | |
|---|---|
| **Main board** | **Radxa Zero 3W** — an off-the-shelf module, *not* a custom carrier |
| SoC | RK3566, quad Cortex-A55, Mali-G52, 0.8 TOPS NPU. Official: 1 GB RAM / 32 GB storage. For a replica a 1 GB or 2 GB board **without eMMC** plus a 32 GB microSD card is enough |
| **Servo bus** | **Single-wire half-duplex TTL** — *not* RS-232, *not* RS-485. Dynamixel Protocol V2 @ 1 Mbps on `/dev/ttyS2` |
| **Custom board 1** | **`imu_to_dxl` v2** — an LSM6DSV16X that speaks Dynamixel: bus ID 200, register 124, a 12-byte block read in the *same* `sync_read` as the servos |
| **Custom board 2** | **RPI Robot HAT** — TLV320AIC3104 @ 0x18, a dormant BMI088, a Stemma header for the ToF. **Published by Pollen** ([`elec_RPI_Robot_HAT`](https://github.com/pollen-robotics/elec_RPI_Robot_HAT)) |
| Battery | Sony NP-F550, 2S Li-ion. **No fuel gauge, no ADC** — pack voltage is read from what the servos report as their own supply |
| Sensors | LSM6DSV16X IMU · VL53L5CX/L8CX 8×8 ToF · IMX219 (Pi Camera v2) |

The `imu_to_dxl` design is the elegant part: the IMU is not on I²C. It presents itself as a
Dynamixel slave, so orientation arrives in the same bus transaction as the joint states —
no second bus, no host-side sensor fusion (the LSM6DSV16X's on-chip SFLP block emits a game
rotation quaternion and estimates its own gyro bias).

**Full detail:** [Hardware Teardown](docs/hardware-teardown.en.md) (English) ·
[Spec Sheet](docs/硬件规格速查.md) (Chinese)

---

## Can You Actually Build One?

| | Status |
|---|---|
| Part geometry | ✅ 47 STLs |
| Assembly relationships | ✅ 0.1 mm accurate, drawings produced |
| Joint axes / travel | ✅ all 14 |
| Mass / inertia | ✅ all 15 bodies |
| Servo model | ✅ Dynamixel XL330 × 15 |
| Bearings | ✅ Ø22×16×4 and Ø15×10×3 |
| Battery / sensors | ✅ NP-F550 2S, IMX219, VL53L8CX, LSM6DSV16X |
| Main board | ✅ **Radxa Zero 3W, off the shelf** |
| **HAT board** | ✅ **Officially published** — KiCad + Gerbers + BOM → [`elec_RPI_Robot_HAT`](https://github.com/pollen-robotics/elec_RPI_Robot_HAT) |
| **`imu_to_dxl` board** | ⚠️ Not published; must be redrawn. Protocol and register layout fully recovered |
| **Fastener list** | ✅ Reverse-engineered from hole features → M2 system |
| **Cable routing** | ❌ Nothing published |
| Control software | ⚠️ Rust runtime is Apache-2.0 and **runs as-is on the same main board** |

⚠️ **Simulation STLs are not manufacturing files.** Simulation only needs outer shape and
inertia — it guarantees nothing about fit tolerances, threads, heat-set insert bosses or
cable clearance. Printing these directly will most likely not assemble.

💰 **Building one probably costs more than buying one — but how much more depends entirely on
your channel.** Fifteen XL330s run about **$359** at ROBOTIS international, **$412** at ROBOTIS US,
and **€603–629** in Europe inc-VAT — anywhere from slightly under the robot's retail price to well
above it. Add the compute module, battery, two boards to fabricate and filament, and it is certainly
more. Full costing: [BOM.en.md](BOM.en.md).

**The conclusion has been revised** from "the mechanics are copyable, the electronics are a wall"
to **"the whole robot is reproducible"** — the main board is an off-the-shelf module, and the custom
boards' function and protocol have been fully recovered from source.
See [Hardware Teardown](docs/hardware-teardown.en.md).

---

## The Realistic Path

Skip 100% replication and go **"copy the mechanics, build your own electronics"**:

| | Approach |
|---|---|
| Mechanics | Select the matching servo version in the [CAD repository](https://github.com/UnitClaw/microduck-replica-cad) |
| Servos | XL330 × 15, off the shelf |
| Main board | **Radxa Zero 3W**, same as the original |
| IMU board | Roll your own `imu_to_dxl`: LSM6DSV16X + a small MCU + half-duplex transceiver. The protocol is fully documented here |
| HAT | **Order the official Gerbers** (4-layer); or skip it entirely if you don't need audio |
| Software | Same main board → the official Rust runtime runs unmodified |
| Policies | The nine shipped ONNX policies work; retrain with [microduck_rl](https://github.com/pollen-robotics/microduck_rl) if you change hardware |

## Three Pitfalls Worth Knowing

1. **Armbian runs a login console on UART2.** `serial-getty@ttyS2` holds the port —
   `systemctl mask` it. Pollen found this with `fuser -v /dev/ttyS2`.
2. **i2c3 collides with the FUSB302.** Using the hardware I²C on header pins 3/5 costs you
   USB-C PD negotiation (plain 5 V charging still works).
3. **The NPU ships disabled** in Armbian — flash the overlay and reboot to run RKNN models.

---

## Ecosystem Map

Microduck material is scattered across several GitHub orgs and three HuggingFace resource types —
**the official hardware repos are especially easy to miss**. [`docs/ecosystem.en.md`](docs/ecosystem.en.md)
annotates every official repo, simulator, policy, dataset and community project with what it is and
what it is good for.

## Documentation

| Document | Contents |
|---|---|
| [**Hardware Spec Sheet**](docs/硬件规格速查.md) | One-page reference — block diagram, part numbers, bus parameters, build list, pitfalls |
| [**Hardware Primer**](docs/硬件入门.md) | **Board by board** — what each of the five modules does, how one 20 ms control tick flows, what changes on the Feetech route, and a closing section on **five checks to run before you replicate** |
| [**Electronics Sourcing (CN)**](docs/电控采购清单.md) | Taobao links with verified availability — main board, camera, ToF, power, both PCBs, cabling and the debug adapter |
| [**Mechanical Sourcing (CN)**](docs/机械采购清单.md) | Bearings, M2 fasteners, heat-set inserts and the insertion tip, thread locker, filament |
| [**Hardware Teardown**](docs/hardware-teardown.en.md) 🇬🇧 | **Full derivation with evidence citations — the main board, both custom boards, bus protocol, sensors, power** |
| [**Actuator Selection**](docs/actuator-selection.en.md) 🇬🇧 | XL330 parameters, BAM M6 config, five calibrated PD sets, backlash modeling — plus **why closed-loop steppers do not work here, what swapping to a Feetech STS3215 actually costs** (737 g vs 2107 g, measured), and a **cross-comparison of same-class servos** including a deep assessment of the Unitree S288 |
| [**Fastener Reconstruction**](docs/fastener-reconstruction.en.md) 🇬🇧 | Hole-feature scan across 47 STLs → M2 system and purchase quantities |
| [Community Intelligence](docs/社区动态.md) | X / GitHub signals, independent verification, noise and scam warnings |
| [Progress](PROGRESS.md) | Status, decisions, open work |

> 🇬🇧 marks documents available in English. The rest are Chinese-only for now — their
> tables, part numbers, addresses and diagrams are readable without it, and machine
> translation handles the prose well.

## Reproducing This

```bash
# 1. Fetch upstream for the drawing scripts below (training is already in software/training/)
bash scripts/fetch_upstream.sh

# 2. Regenerate the drawings
python scripts/render_assembly.py upstream/microduck_rl assembly-drawings

# 3. Export upstream assembly previews for analysis (not manufacturing)
python scripts/export_assembly_stl.py upstream/microduck_rl analysis-output/cad-upstream

# 4. Re-scan hole features
python scripts/analyze_holes.py upstream/microduck_rl/src/mjlab_microduck/robot/microduck/assets
```

Requires `mujoco`, `numpy`, `pillow`, `scipy`. Rendering needs a working OpenGL context.

## License

- `scripts/`, the code in `software/studio/`, and `software/image/` — Apache-2.0
- The walking and skill models in the replica image are not in this repository; they are under their author's personal non-commercial licence, so **the image must not be distributed with any paid product** (see the [model notes](software/image/overlay/usr/share/doc/microduck/模型说明.txt), Chinese)
- `assembly-drawings/` and retained simulation meshes — **CC BY-SA-NC 4.0**. Upstream 3D models are CC BY-SA-NC;
  ShareAlike requires derivatives to carry the same license. **Non-commercial only.**

See [NOTICE.md](NOTICE.md). Not affiliated with or endorsed by Pollen Robotics.
