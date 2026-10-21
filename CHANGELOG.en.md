# Changelog

This file holds the complete history. The README shows only the latest few entries; this file is authoritative.

---

## 2026-10-21 — Replica image 20261021b (pre-release)

On top of 20261021: the hotspot opens immediately on first boot (no more 45 s wait); the SSH card on the "More" page registers your own public key, so you can SSH without enabling password login; double-clicking a checklist "Skip" no longer accidentally hits "Done"; the bus IMU now recognizes this repository's own imu_to_dxl board in addition to kissqy's FT6 board (the main program reads it last in the full-body read — reading it first collides with servos). Another firmware revision 1.0.0 (with real-bus servo testing) is in [`hardware/imu_to_dxl/firmware-1.0.0/`](hardware/imu_to_dxl/firmware-1.0.0/). [Download (Releases)](https://github.com/UnitClaw/microduck-replica/releases/tag/microduck-replica-image-20261021b) · [Pitfalls](踩坑记录.md) (Chinese).

## 2026-10-21 — Replica image 20261021 (pre-release, replaces 20261020)

Running the full flow from scratch on our second duck with a fresh card turned up a batch of problems, all fixed in this build: the fork's commissioning mode kept reporting "starting up" so Studio got no readings; the checklist could not be skipped; skipping everything left you unable to enter motion mode; the robot could not stand in commissioning mode (the fork added `hold-home`, which moves all 15 servos to the standing pose over 3 seconds and locks them, so you can calibrate the IMU standing without switching to motion mode first); with Clash running the `.local` address would not open; after WiFi setup you had to change the address yourself; the SSH host key was never generated. Studio's "More" page also gained an **SSH switch**: set your own password to log in and fix things without reflashing (the image carries no one's keys and no default password). **The 20261020 build stalls at step 2 — use the new one.** Standing enable in commissioning mode and the "skip → write into the main program → pair gamepad → walk" sequence have not been fully run on a real duck yet; this becomes a full release once they pass. [Download (Releases)](https://github.com/UnitClaw/microduck-replica/releases/tag/microduck-replica-image-20261021) · [flashing and first use](software/image/烧录和第一次使用.md) (Chinese) · [Pitfalls](踩坑记录.md) (Chinese).

## 2026-10-20 — Replica image, first build (pre-release, real-duck test pending)

One card with everything (our fork of the main program, the walking and skill models, Studio, first boot and WiFi setup): flash it, boot, join the duck's hotspot from a phone, enter your home WiFi in Studio and follow the checklist, no SSH. After the first build we ran a three-way review and found that a fresh card cannot get through the "IMU mount" and "write into the main program" steps: out of the box the main program has to run in commissioning mode, and the image had it in motion mode. Fixed and rebuilt; it is out as a pre-release on [Releases](https://github.com/UnitClaw/microduck-replica/releases/tag/microduck-replica-image-20261020) and becomes a full release once it passes on a real duck. [Flashing and first use](software/image/烧录和第一次使用.md) · [image build scripts](software/image/) (Chinese).

## 2026-10-20 — Three new custom boards drawn

Bus IMU board v2 (its servo connector is now an A2007WR-3P that takes the Feetech plug), a servo bus hub and a battery terminal board; EasyEDA projects and 3D models are in [`hardware/新版/`](hardware/新版/) (Chinese). None has been made or tested yet.

## 2026-10-20 — Microduck Studio, first release: a console in the browser

A web console that runs on the duck, written by us. Open `http://<duck IP>:8000/` to watch the robot, relax it in one click, calibrate servo zeros, work out the IMU mount, write it into the main program, pair a Bluetooth gamepad, test the e-stop and make the duck stand up and walk, following a step-by-step checklist with no SSH. It already runs as a boot service on our second duck; gamepad pairing and the e-stop were tested on it. "Write into the main program" has not been tested on a real duck yet, and editing walking parameters from the page is not done yet. [Studio and how to install it](software/studio/) (Chinese).

## 2026-10-15 evening — the cause of "falls after two or three steps" found; the duck now walks steadily

The BNO085's own fused orientation jumps 20–60° within 20 ms while walking (mostly around foot strikes), while its gyro says the trunk turned 1–2°; the policy believes it is falling and its correction makes it fall. robotd can now carry the attitude with the chip's own gyro and only follows the chip slowly when the two agree. On the robot: in the old mode, 9 s of pushing the stick gave 2 falls; in the new mode, 60 s of pushing gave none, and 10+ minutes in walk mode (60 s of it pushing the stick) only one fall, while the chip still jumped 745 times — none of them reached the policy. No interleaved A/B was run (the user saw it on site and kept the new mode); turning is still weak and the board still reboots now and then. Code on the fork branch [`hd1910-v167-gyro-fusion`](https://github.com/fanhao375/Microduck-kissqy/tree/hd1910-v167-gyro-fusion) (the default is still the old mode; switching: [IMU-MODULE.md 4.4](https://github.com/fanhao375/Microduck-kissqy/blob/hd1910-v167-gyro-fusion/IMU-MODULE.md), Chinese). [Full record: symptom, strategy, analysis, fix, on-robot data](docs/HD1910-20261015-IMU乱跳根因与陀螺融合上机.md) (Chinese).

## 2026-10-14 evening — IMU modules for kissqy's full stack (fork)

kissqy's one-click stack only reads the IMU board on the servo bus, so a duck with a ready-made IMU module cannot use it. We added "IMU module on the board's own I²C" (BNO085 / LSM6DSV16X) to his robotd and published it in our fork [fanhao375/Microduck-kissqy](https://github.com/fanhao375/Microduck-kissqy) (branch `hd1910-v167-trunk-imu-i2c`, on top of his 10-14 V167). **It is not an official kissqy release** — report problems here. BNO085 has run on our first robot (on V164); the V167 merge has only passed unit tests and **has not run on a robot yet**, nor has LSM6DSV16X. We test it on our robot tonight and will update this note. Wiring, build, the installer and confirming the IMU mount: [IMU-MODULE.md](https://github.com/fanhao375/Microduck-kissqy/blob/hd1910-v167-trunk-imu-i2c/IMU-MODULE.md). Also: kissqy's V167 "body jitter fix" writes servo D=0 and torque limit 1000 on every arm, matching our 10-13 finding; a duck with an IMU module **must not use "install/upgrade firmware" in his console**, which would remove the module support.

## 2026-10-14 — Feetech's official HD-1910 BAM actuator model

At the end of September Feetech published [ftservo/ftservo-bam](https://gitee.com/ftservo/ftservo-bam) on Gitee (Apache-2.0, a fork of Rhoban/BAM), with m1–m6 parameters for the HD-1910 identified at 7.4 V and a dedicated HD-1910 controller model. Until now everyone has trained with the 1910 M6 parameters published by LuwuDynamics; the manufacturer's own set is now available to compare. The two differ substantially (motor resistance: Feetech 2.97 Ω, LuwuDynamics 4.91 Ω; computed stall torque: Feetech 1.37, LuwuDynamics 0.91 N·m), and **we have not yet verified on hardware which one matches the real servo better**. Feetech's recording script sets P but not D, so the servos were most likely at the factory D=40 — confirm D before deploying a policy trained on it. Loading and gain-conversion details: [comparison and integration notes](docs/HD-1910-M6参数来源.md#飞特官方-hd-1910-bam) (Chinese).

## 2026-10-13 night — Brownouts, servo D and foot scraping

Both cards brown out while walking; the supply cannot hold the current spikes — it is not software. The walking jitter is linked to the servos' hardware D (damping): the actuator model used in training has no D term, and setting D=0 cut the high-frequency share of torso motion from 51% to 4–8%; we now run P3 / D0 / torque limit 700. The feet scrape because both lift only half as high as in simulation, and with D=0 the left toe also points down; next we try D=5–10. kissqy's one-click image (V164) does not write D or the torque limit, so changing them in the console has no effect. [Full record](docs/HD1910-20261013-夜-掉电-舵机D与蹭地.md) (Chinese) · [Where our software comes from and what we changed](docs/软件来源与我们的改动.md) (Chinese) · [Gait analysis scripts](tools/gait-analysis/).

## 2026-10-12 night — IMU calibrated, first stable stand and alternating steps

The reason the walking policy charged backwards and fell as soon as it took over was an **IMU module mounted about 8.5° off**. The policy was trained with a level torso at HOME, but the IMU kept reporting an 8.5° forward lean, so the policy kept "recovering" backwards. We computed the expected torso attitude from the real joint angles in simulation and folded the difference into the IMU mounting quaternion. Afterwards the policy held the robot upright for 70 s (mean tilt 0.2°), and pushing the stick produced alternating steps (forward distance not measured yet). The web gamepad lag was traced to four layers; a Bluetooth gamepad paired directly to the robot bypasses all of them. [Full log and the IMU zero-calibration method](docs/HD1910-20261012-夜-IMU校准与首次迈步.md) (Chinese) · [analysis scripts](tools/radxa/onboard-analysis/).

## 2026-10-12 — Main board correction

We previously recommended the Radxa Zero 3W "2 GB / 16 GB eMMC" SKU. **That was unnecessary and cost people money.** The official spec only says 1 GB RAM and 32 GB storage. Our first robot runs a 2 GB board **without eMMC** on a microSD card; with the full kissqy stack it uses 175 MB of RAM and 3.3 GB of storage. **A 1 GB or 2 GB board without eMMC plus a 32 GB microSD card is enough.** Buy from official distributors (ALLNET, Radxa's official stores) rather than resellers. A 2G/16G board you already bought works fine. See the [purchase guide](docs/电控采购清单.md#该买哪个配置) (Chinese).

## 2026-10-12 — Assembly videos

A from-scratch assembly series is available on Bilibili. Six of eight episodes are out: parts list, lower legs, thighs, torso, neck and head.

## 2026-09-29 — Image login correction

The original public image requires **`root / 1234`** for the first login. Complete the Armbian wizard before using `duck / duck1234`; it also changes the root password. Change both default passwords immediately. The old image still needs the `wlan0` DHCP fix. The [guide](tools/radxa/镜像使用说明.md) is corrected, and a separate DHCP fix candidate image was published at the time. (10-21: both September base images have been taken down from Releases; for a ready-made card use the [replica image](https://github.com/UnitClaw/microduck-replica/releases/latest).) It contains neither the robot runtime nor the web servo console.

## 2026-09-28 — HAT feedback test

Web console **0.15.4** is deployed on the board, with responses matched by their actual servo ID and a 50 Hz sampling target. While holding the existing pose for about 64 seconds, all 14 joints returned **3,000/3,000** valid samples (42,000 total), with no timeout, checksum or ID errors in that window. The observed rate was **46.87 Hz**. Torque remained enabled and goals/settings were unchanged. **The full control loop with IMU, inference and motion writes, and the walking policy, remain unverified.** Occasional missing responses have occurred outside this window. See the [test scope and results](tools/radxa/50Hz保持姿势读状态-20260928.md) (Chinese).

## 2026-09-28 — HAT and camera bring-up

The HAT has arrived and been fitted to the board. After the camera ribbon orientation/contact was corrected, the Radxa Camera 8M219 was identified and **40 frames at 1920×1080** were captured on official Bookworm B1. The next step is to return to the project Armbian image and repeat the test with the corrected wiring. Sustained frame rate, all HAT functions and robot walking remain unverified. See the [wiring reference and test record](tools/radxa/摄像头调试记录-20260928.md) (Chinese).
