> **这个 Release 已于 2026-10-21 撤下**（太旧了）。现成的卡请用[复刻镜像](https://github.com/UnitClaw/microduck-replica/releases/latest)。下面是当时的发布说明，留作记录。

> **候选镜像（Pre-release）：已完成离线核验，尚未对这份新产物烧卡、启动和联网实测。** 本版从 20260920 原公开镜像制作，只补无线 DHCP、修正卡内登录/联网说明、移除预生成 SSH 主机密钥。旧版文件仍保留在原 Release。已有旧卡可按指南修复，不必只为这次更新重刷。

适用基线：Radxa Zero 3W V1.12 / AIC8800，Armbian 26.2.1 Trixie vendor 6.1.115 minimal + 瑞莎 `u-boot-rk2410`。其他板卡批次、摄像头和路由器需要分别验证。

**这是基础系统，不包含机器人运行时、网页调试台、舵机设置、IMU 配置或步态策略。没有写入个人 WiFi、代理或登录密钥。** 本机 09-28 已验证联网的是另一份个人镜像，不能把该结果当作本候选产物已完成烧卡测试。

### 附件

| 文件 | 用途 |
|---|---|
| `armbian-26.2.1-zero3w-v1.12-dhcpfix-20260929.img.xz` | 新候选镜像，用 Rufus / balenaEtcher / Armbian Imager 写入至少 8 GB 的卡 |
| `sha256.txt` | 校验本版压缩镜像；不要混用旧版的校验值 |
| `radxa-zero3w-image-guide-zh.md` | 首次登录、联网、换 WiFi、旧卡修复、供电与板卡批次说明 |
| `image-verification-20260929.json` | 离线检查、来源、裸镜像/压缩文件 SHA256、逐文件差异及未实机测试标记 |

压缩镜像大小：419,157,756 字节；SHA256：

```text
d7a4dc60a0c622786ae3eb03ebea2d5316d4cff44373945f4a61f44ac7019f63
```

### 第一次登录与联网

1. 校验下载文件后烧卡。USB 串口使用主板 **`5V IN / USB_OTG`（USB 2.0）口**，数据线连接电脑，由 USB 单独供电；不要与 HAT 输入叠加供电。USB 3.0 Host 是外设接口。
2. 等启动后出现 COM 口，以 **115200 8N1** 打开。**首次账户是 `root / 1234`**，不是 duck。
3. 完成 Armbian 首次登录向导（shell 可选 `bash`），向导才创建 `duck / duck1234` 并把 root 密码设为 `duck1234`。仍在 root 终端时立即执行 `passwd`、`passwd duck` 改掉两个默认密码。向导中断时可能处于中间状态，继续用已设置的 root 密码完成初始化。
4. 按随附指南第 4 节配置自己的 WiFi。`wpa_supplicant` 负责认证，本版预置的 `/etc/systemd/network/25-wlan0.network` 由 `systemd-networkd` 申请 IPv4 地址。基础镜像没有 NetworkManager / `nmtui`。
5. 检查 `wpa_state=COMPLETED`、IPv4 地址和默认路由后，再从同一可互通局域网使用 `ssh duck@主板IP`。首次 SSH 请核对主板本地显示的主机指纹。

### 本次核验

- 来源只使用原公开 `.img.xz`，SHA256 为 `4de8a355d3d9180e465af486c409e9b3e4ac82c0e241dc73d4fc0f0db7a67579`，没有使用带个人 WiFi 的镜像。
- GPT 根分区从 32768 扇区开始。前 16 MiB 引导区域逐字节未变，内核、DTB、overlay 和账户库均未改。
- 根分区只读 `e2fsck -f -n` 通过；挂载使用 `ro,noload` 做最终检查。文件内容、权限、属主和符号链接与原版比对，只涉及上面列出的三类变化。
- root 初始密码匹配 `1234`，不匹配 `duck1234`；初始无 duck，保留原 Armbian 首次登录预设和流程。
- 候选镜像不含 SSH 主机密钥；空 `machine-id` 与已启用的 `sshd-keygen.service` 使原系统在首次启动执行 `ssh-keygen -A`。已核实静态服务机制，实际首次启动仍待验证。
- 没有 WiFi 认证文件、个人代理、authorized_keys、用户目录内容或 shell 历史。旧镜像主机私钥的完整内容也未残留在新裸镜像中。卡内联网命令通过 Bash 语法检查。

完整数据以附件核验报告为准。离线校验不替代烧卡启动、SSH 密钥生成、实际无线连接或硬件验收。

### 项目进度与来源

主板上另行部署的调试台 0.15.4，曾在保持既有姿势的约 64 秒窗口中读到 14 颗各 3000/3000 有效状态，目标 50 Hz、实际约 46.87 Hz，窗口内无 timeout/checksum/ID 错误。其他时段仍有偶发缺应答；这不代表完整控制循环、IMU、带载动作或步态验收。摄像头目前仅官方 B1 确认出图。见[测试摘要](https://github.com/UnitClaw/microduck-replica/blob/master/tools/radxa/50Hz%E4%BF%9D%E6%8C%81%E5%A7%BF%E5%8A%BF%E8%AF%BB%E7%8A%B6%E6%80%81-20260928.md)。

底包来自 [Armbian](https://www.armbian.com/radxa-zero-3/)，引导来自瑞莎 [`u-boot-rk2410`](https://radxa-repo.github.io/bookworm/pool/main/u/u-boot-rk2410/)，遵循 GPL 及各软件自身许可。这是社区修改版，并非 Armbian 或瑞莎官方发布。[制卡脚本与指南](https://github.com/UnitClaw/microduck-replica/tree/master/tools/radxa)。
