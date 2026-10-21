# Radxa Zero 3W · 做一张能直接开机的 Armbian 卡

> **2026-10-21：9 月的两个底包镜像（20260920、20260929）已从 Releases 撤下**，太旧了。要现成的卡请用[复刻镜像](https://github.com/UnitClaw/microduck-replica/releases/latest)：烧了就能用，带主程序、走路模型和 Studio。这个目录的做卡脚本保留，自己做卡照旧可用；下面提到那两个 Release 的地方只是历史记录。

配合 [不打 HAT · 第 1 步](../../docs/不打HAT.md#第-1-步--主控点亮什么都别接) 用。
此前本机 V1.12 板（AIC8800 Wi-Fi）使用所测 Armbian 原版镜像启动失败，经引导程序对照和替换后解决；不同批次见镜像说明。**双闪本身不是故障码**，2026-09-28 官方 B1 在正常联网和采集时也使用 `heartbeat` 双闪。
此前排查指向 Armbian 所用主线 U-Boot / 内存初始化固件与本机的兼容性，换用瑞莎引导后能够启动。
这个目录把换引导、写 WiFi、配置 DHCP、开串口、开 USB 控制台打进镜像里，供首次启动联网使用。

2026-09-28 已修正做卡脚本遗漏 `wlan0` DHCP 的问题；9 月 20 日 Release 的镜像和校验值仍为旧文件，没有包含此修复。已经烧录旧镜像的用户按[联网步骤](镜像使用说明.md#4-连-wifi)补配置即可，不必仅为此重刷；卡内的旧联网提示也以这篇说明为准。本机修复后的个人镜像已实测取得 DHCP 地址并通过 SSH 登录；这不代表所有板卡和路由器均已验证，见[实测记录](联网与HAT调试记录-20260928.md)。

**不想自己做卡？** 用[复刻镜像](https://github.com/UnitClaw/microduck-replica/releases/latest)（烧了就能用，带主程序和 Studio）。下面这段是 9 月底包镜像的历史说明（不带 WiFi，插 USB 当串口进去连），
首次配置和板卡批次差异见[镜像使用说明](镜像使用说明.md)。更换电脑不影响系统；更换 WiFi 需重新填写连接信息，不必重刷。

**首次登录勘误（2026-09-29）：`root / 1234`。** 完成 Armbian 向导后才创建 `duck / duck1234` 并改 root 密码；`card.conf` 中的用户名密码是向导预设，不是首次认证凭据。请随即改掉默认密码。新的 20260929 候选镜像预置 DHCP、更新卡内说明并移除预生成 SSH 主机密钥，经过离线检查，尚未烧卡实测。旧卡不必重刷，按指南修复 DHCP 和重建 SSH 主机密钥即可。

| 文件 | 干什么 |
|---|---|
| `card.conf` | 改 WiFi 名 / 密码；首次 `root / 1234` 登录后，向导默认创建 `duck` / `duck1234`。国内要装官方软件时可填 HTTP 代理。**WiFi 两行留空 = 公开镜像模式**，不写 WiFi 认证信息，仍预置 DHCP |
| `镜像使用说明.md` | 给 release 里那张镜像用的：烧卡、USB 串口登录、连 WiFi、换引导救别的批次的板子 |
| [摄像头调试记录-20260928.md](摄像头调试记录-20260928.md) | 排线接线参考图、官方 B1 对照结果、IMX219 识别与限量抓帧命令；原 Armbian 正确接线复测待完成 |
| [联网与HAT调试记录-20260928.md](联网与HAT调试记录-20260928.md) | DHCP 修复后的主板登录、HAT 舵机只读通讯结果和待排查项 |
| `1-做卡.ps1` | Windows 右键「使用 PowerShell 运行」，选下载的 `.img.xz`，出一个 `xxx-鸭子卡.img`，Rufus 烧它 |
| `build-armbian-card.sh` | 实际干活的脚本，Linux / WSL 里 `sudo bash build-armbian-card.sh xxx.img.xz card.conf` |
| `kissqy-r1-v112.sh` | 在 kissqy 的「一键系统镜像 R1」上换瑞莎引导、写 extlinux，让 V1.12 板能开机；他的固件、模型、首次配网原样保留。可选 `--no-camera`、`--no-tof`、`--overlay i2c4-m0`。`sudo bash kissqy-r1-v112.sh microduck-zero3w-0.15.1-R1.img.xz [选项]`。为什么要改、离线验证结果见 [kissqy 镜像 R1 分析](../../docs/HD1910-20261012-kissqy镜像R1分析.md)；**还没上机** |

两个脚本都会先找同目录下的瑞莎引导包 `u-boot-rk2410_2017.09-64-39cd993_arm64.deb`，没有才去 radxa-repo.github.io 下载。WSL 里 curl 下这个站偶尔 SSL 中断，这时先在 Windows 上下好，放到脚本同目录（校验值脚本会核对）。用完删掉，别把这个 .deb 提交进仓库。

镜像用 **Armbian 26.2.1 trixie vendor 6.1.115 minimal**（Pollen 官方指定；国内镜像站只剩 26.8.1，
26.2.1 在 `https://fi.mirror.armbian.de/archive/radxa-zero3/archive/`）。瑞莎引导程序从
`radxa-repo.github.io` 的 `u-boot-rk2410` 包自动下载，脚本里锁了版本和 sha256。

脚本做的五件事：

1. 扇区 64 写 `idbloader.img`，扇区 16384 写 `u-boot.itb`（瑞莎 u-boot-rk2410 2017.09-64，DDR v1.25，BL31 v1.46）
2. `/boot/extlinux/extlinux.conf`：瑞莎 U-Boot 认 extlinux 不认 Armbian 的 boot.scr；挂 `uart2-m0`（舵机串口 `/dev/ttyS2`）和 `dwc3-peripheral`（OTG 口当 USB 串口）两个 overlay，内核控制台放 tty1
3. 首次登录向导预设 `/root/.not_logged_in_yet`（用户、密码、时区、locale），在认证后才应用；`wpa_supplicant-wlan0.conf` 配置 WiFi 认证，`/etc/systemd/network/25-wlan0.network` 配置无线 DHCP；移除底包预生成的 SSH 主机密钥，保留原系统的首次启动生成服务
4. `g_serial` + `serial-getty@ttyGS0`：板子插电脑多出一个 COM 口，115200，root 能登
5. mask 掉 `serial-getty@ttyS2` / `ttyFIQ0`，登录控制台不占舵机串口

完成首次登录向导和网络配置后，路由器里找 `radxa-zero3`，用 `ssh duck@IP` 登录。基础镜像不含完整机器人控制环境，不能仅凭联网就认为网页或舵机控制已经可用。

后续安装可参考 Pollen 官方 [install-dev.md](https://github.com/pollen-robotics/microduck/blob/main/docs/robot/install-dev.md)，但**本镜像不能直接照搬 `migrate-network.sh` → 重启的步骤**。当前检查的上游迁移脚本从 netplan 导入无线凭据，不会读取本镜像的 `wpa_supplicant-wlan0.conf`，也不会自动退出独立的 `wpa_supplicant@wlan0` / `25-wlan0.network` 配置。应先保留现有联网方式，待适配凭据导入、旧服务退出和失联恢复后再迁移，避免重启失联。

安装脚本对 `armbianEnv.txt` 的修改也需核对到实际启动使用的 `extlinux.conf`，不能只依据脚本的检查结果判断硬件已配置完成。

## 上机分析脚本

[`onboard-analysis/`](onboard-analysis/)：2026-10-12 夜用来查「模型一接管就猛冲」的脚本，全部只读。包括 50 Hz 录像（开机自启服务）、电压温度记录、IMU 自洽检查、四方向检查、**IMU 零点校准**（站 HOME → 仿真算应有倾斜 → 新安装四元数）、失控转折点、推摇杆迈步统计、IMU 断线分析。
