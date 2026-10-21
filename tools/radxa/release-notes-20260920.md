> **这个 Release 已于 2026-10-21 撤下**（太旧了）。现成的卡请用[复刻镜像](https://github.com/UnitClaw/microduck-replica/releases/latest)。下面是当时的发布说明，留作记录。

> **2026-09-29 首次登录勘误：先用 `root` / `1234`。** 公开镜像中尚无 `duck`；完成 Armbian 首次登录向导后，才创建 `duck` / `duck1234` 并把 root 密码改为 `duck1234`。这是对原公开镜像账户库及首登脚本只读核实的结果。此前“首次直接用 duck 登录、root 初始密码相同”的说明有误。请完成向导后立即修改两个默认密码。
>
> **2026-09-28 联网勘误：** 旧版制卡脚本遗漏了 `wlan0` 的 DHCP 配置。即使 WiFi 名和密码正确，也可能无法取得 IPv4 地址，导致 SSH 找不到主板。仓库脚本已经补上；已经烧录的卡可按下文补配置，不必仅为此重刷。
>
> **本 Release 的 `.img.xz` 镜像和 `sha256.txt` 仍为 9 月 20 日的原文件，没有包含本次修复。** 本次更新的是 Release 说明、随附使用指南和仓库制卡脚本。卡内 `/root/先连WiFi.txt` 是旧提示，请以更新后的指南为准。本机修复后的个人镜像已实测取得 DHCP 地址并通过 SSH 登录，`networkctl` 确认使用新增配置；这是单台设备的验证，不等于公开镜像已替换或所有失联问题都已解决。

这是面向此前本机 Radxa Zero 3W V1.12（AIC8800 WiFi）引导兼容性问题制作的社区镜像：使用 Armbian 26.2.1 Trixie vendor 6.1.115 minimal 的内核和系统软件包，替换瑞莎引导程序，并调整启动、登录和网络配置。不同板卡批次需单独验证。

另有独立的 20260929 DHCP 修复候选版，保留本页旧文件。候选版只做过离线检查，未对该新产物烧卡实测。离线检查还发现旧版携带预生成 SSH 主机密钥；旧卡请按[更新后的使用指南](https://github.com/UnitClaw/microduck-replica/blob/master/tools/radxa/%E9%95%9C%E5%83%8F%E4%BD%BF%E7%94%A8%E8%AF%B4%E6%98%8E.md#%E6%97%A7%E7%89%88%E5%8D%A1%E9%87%8D%E6%96%B0%E7%94%9F%E6%88%90-ssh-%E4%B8%BB%E6%9C%BA%E5%AF%86%E9%92%A5)通过本地终端重新生成，不必重刷。

**绿灯双闪可为正常 `heartbeat`，不能单凭闪灯判断启动失败或镜像损坏。** 基础镜像也不等于已安装完整机器人软件；联网、摄像头和舵机控制要分别验收。

### 下载哪个

| 文件 | 说明 |
|---|---|
| `armbian-26.2.1-zero3w-v1.12-bootfix-20260920.img.xz` | 原公开镜像，不含 WiFi 名/密码；烧录后必须配置 WiFi 并补上 DHCP。可用 Rufus / balenaEtcher / Armbian Imager 写卡 |
| `sha256.txt` | 上述原镜像的 SHA256，保持不变 |
| `radxa-zero3w-image-guide-zh.md` | 2026-09-29 更新：首次 root 登录、向导完成后的账户、旧卡 DHCP 修复、换 WiFi、USB 接口与供电说明；内容与[仓库使用说明](https://github.com/UnitClaw/microduck-replica/blob/master/tools/radxa/%E9%95%9C%E5%83%8F%E4%BD%BF%E7%94%A8%E8%AF%B4%E6%98%8E.md)同步 |

原 `.img.xz` 文件的 SHA256：

```text
4de8a355d3d9180e465af486c409e9b3e4ac82c0e241dc73d4fc0f0db7a67579
```

### 第一次烧录和登录

1. 校验镜像后烧入至少 8 GB 的卡。
2. 使用**能传数据的 USB 线**，连接主板 **`5V IN / USB_OTG`（USB 2.0）口**和电脑，由 USB 单独供电。另一个 **USB 3.0 Host** 口用于外设，不是电脑连接板载 USB 串口的接口。
3. 首次启动先等约 2~3 分钟；正常启动并加载 USB gadget 后，电脑应出现 COM 口。串口工具设 **115200 8N1**，回车，第一次登录 **`root` / `1234`**。完成 Armbian 向导（shell 选项可选 `bash`）后，才有 `duck` / `duck1234`，root 密码也才改为 `duck1234`。仍在 root 终端时运行 `passwd` 和 `passwd duck` 修改两者密码，之后用 duck 日常登录。若向导中断，账户可能处于中间状态；用已设置的 root 密码重新登录完成向导，不必重刷。没有 COM 口时先检查接口、数据线和供电，不能只看绿灯。
4. 公开镜像没有预设 WiFi。按[使用说明第 4 节](https://github.com/UnitClaw/microduck-replica/blob/master/tools/radxa/%E9%95%9C%E5%83%8F%E4%BD%BF%E7%94%A8%E8%AF%B4%E6%98%8E.md#4-%E8%BF%9E-wifi)的“第一次联网，或者更换 WiFi”配置无线认证和 DHCP；基础镜像没有安装 NetworkManager，不能直接用 `nmtui`。

**HAT 供电提醒：** HAT / 40 针的 5V 与 USB_OTG 的 VBUS 接在同一电源网络，不要同时接 HAT 电源和普通电脑 USB 数据线供电。需要改用 USB 串口时，先正常关机、断开 HAT 输入，再切到 USB 单独供电；HAT 供电调试优先通过 WiFi + SSH。

### 旧卡已经填好 WiFi：只补 DHCP

以下用于仍采用 `wpa_supplicant` + `systemd-networkd` 的本项目基础镜像。如果后续已经迁移到 NetworkManager，请通过它检查连接和 IPv4 自动获取，不要同时启用两套无线管理服务。

通过 USB 串口或本地终端登录，保留原来的 WiFi 名和密码，执行：

```bash
sudo mkdir -p /etc/systemd/network
sudo tee /etc/systemd/network/25-wlan0.network >/dev/null <<'NETWORK'
[Match]
Name=wlan0

[Network]
DHCP=ipv4
NETWORK
sudo chmod 644 /etc/systemd/network/25-wlan0.network
sudo systemctl enable --now systemd-networkd wpa_supplicant@wlan0
sudo networkctl reload
sudo networkctl reconfigure wlan0
```

等待约 30 秒，再检查：

```bash
sudo wpa_cli -i wlan0 status   # 应有 wpa_state=COMPLETED
ip -4 a show wlan0            # 应有路由器分配的 IPv4 地址
ip -4 route                   # 应有默认路由
networkctl status wlan0       # 看匹配的配置及 DHCP 状态
```

默认 netplan 只匹配有线网卡；`wpa_supplicant` 负责无线认证，本次补的 `25-wlan0.network` 让 `systemd-networkd` 为无线接口申请 IPv4 地址。**只填 WiFi 密码不等于已经配好 DHCP。**

若仍不通，按顺序检查：有没有 `wlan0` → 无线认证是否完成 → 是否获得 IPv4 地址和默认路由 → 电脑与主板是否在同一个可互通的局域网。认证未完成先查名称、密码、信号和路由器模式；此补丁不能代替这些检查。详细诊断命令见随附指南。

### 换电脑 / 换 WiFi 要不要重刷

- **换电脑不需要重刷。** 电脑和主板在同一个可互通的局域网，用 `ssh duck@主板IP` 登录即可；访客网络或 AP 隔离可能阻止互访。
- **换 WiFi 需要重新填写新网络的名称和密码，不需要重刷。** 从 USB 串口或本地终端按指南第 4 节重新配置；重启无线服务会断开原来的无线 SSH。
- DHCP 地址可能变化，请通过主板 `ip -4 a show wlan0` 或路由器设备列表重新找 IP，不要固定沿用以前的地址。
- 想烧卡前预设自己的 WiFi，可使用修正后的[制卡脚本和配置说明](https://github.com/UnitClaw/microduck-replica/tree/master/tools/radxa)。自己生成的带密码镜像仅供个人使用，不要公开上传。

本镜像的无线凭据不在 netplan 中，**不要直接照搬上游 `migrate-network.sh` → 重启的流程**。先保持当前可用连接，迁移前需适配凭据导入、旧服务退出和失联恢复；否则可能因网络管理服务争抢或未导入密码而失联。

### 引导、外设与板卡批次

原镜像换入 `u-boot-rk2410` 引导，使用 `extlinux.conf` 启动；配置 `uart2-m0` 和 `dwc3-peripheral` overlay，并将登录控制台从舵机串口移到 USB gadget。它们分别用于 `/dev/ttyS2` 舵机串口和 USB 串口登录，不代表机器人控制软件已安装或硬件已验收。

2026-09-28 本机完成 HAT 只读通讯测试，随后修复同步读按 ID 归档并部署网页调试台 0.15.4；保持既有姿势约 64 秒，14 颗各 3000/3000 状态有效、窗口内零错误，目标 50 Hz、实际约 46.87 Hz。其他时段仍有偶发缺应答，保护、运动和完整控制循环未验收；这个单独部署的调试台不在本镜像中。见[3000 轮摘要](https://github.com/UnitClaw/microduck-replica/blob/master/tools/radxa/50Hz%E4%BF%9D%E6%8C%81%E5%A7%BF%E5%8A%BF%E8%AF%BB%E7%8A%B6%E6%80%81-20260928.md)。

群友报告在其 V1.12J / AIC8800DS2 板上，通过 **B1 引导 + B1 DTB + Armbian 6.1.115 内核 + Trixie 系统** 跑通；本项目尚未独立验证这一组合。不能仅凭内核同为 6.1 就认定 DTB 通用，换 DTB 后还需检查串口和 USB overlay。相关经验和操作注意事项见指南第 6 节。

2026-09-28 摄像头测试是在**瑞莎官方 B1** 上，调整排线方向/接触后识别 IMX219 并完成 40 帧短测；本项目 Armbian 镜像上的复测尚未完成。见[接线图与调试记录](https://github.com/UnitClaw/microduck-replica/blob/master/tools/radxa/%E6%91%84%E5%83%8F%E5%A4%B4%E8%B0%83%E8%AF%95%E8%AE%B0%E5%BD%95-20260928.md)。

### 来源与许可

- 底包：[Armbian 官方 Radxa Zero 3 镜像](https://www.armbian.com/radxa-zero-3/)，26.2.1 Trixie vendor 6.1.115 minimal，GPL 及各软件自身许可。
- 引导：瑞莎 [`u-boot-rk2410`](https://radxa-repo.github.io/bookworm/pool/main/u/u-boot-rk2410/) `2017.09-64-39cd993`，GPL-2.0。
- 制卡步骤见 [`build-armbian-card.sh`](https://github.com/UnitClaw/microduck-replica/blob/master/tools/radxa/build-armbian-card.sh)；当前脚本包含 DHCP、首登说明和 SSH 主机密钥处理的修正，产物不会与本页保留的旧镜像逐字节相同。

社区自制镜像，并非 Armbian 或瑞莎官方发布。问题请附板卡版本和已遮去个人信息的日志，在本仓库开 [issue](https://github.com/UnitClaw/microduck-replica/issues)。
