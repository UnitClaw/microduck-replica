# Microduck 复刻

**简体中文** · [English](README.en.md)

> **模型与打印文件统一入口：[microduck-replica-cad](https://github.com/UnitClaw/microduck-replica-cad)。** 飞特 / XL330 请选对应版本；本仓旧打印 STL 已移除，避免误打。

> **装配视频教程：[B 站合集《MicroDuck 从零安装教程》](https://space.bilibili.com/312747174/lists/9279084?type=season)**，一集装一个部件，共 8 集，已更新 6 集 → [分集目录](#-装配视频教程)

> 对 [Pollen Robotics Microduck](https://pollen-robotics.com/microduck/) 的第三方复刻研究。
> 从官方公开的 MJCF 仿真模型反推出**装配图、爆炸图和可直接导入 CAD 的装配体**。

Microduck 是一只 25cm 高、737g 的双足机器鸭，15 个 Dynamixel XL330 舵机（14 个受策略控制），用强化学习走路。
它的**软件开源（Apache-2.0）**。硬件是**部分开源**：

- ✅ **RPI Robot HAT 板完整开源** —— 见 [`pollen-robotics/elec_RPI_Robot_HAT`](https://github.com/pollen-robotics/elec_RPI_Robot_HAT)（Apache-2.0）：
  KiCad 9 工程、Gerber、BOM、贴片坐标、STEP 一应俱全。这块板**不需要自己画**。
- ❌ **`imu_to_dxl` 板未开源** —— 全网无公开工程，本仓库的逆向是目前唯一公开重建。
- ❌ **机械件无可编辑 CAD**、无 BOM、无装配文档。

> 📌 **勘误（2026-09-03）**：本文档此前写作「硬件不开源、没有 PCB 原理图」，**这是错的**。
> 当时只检索了 `pollen-robotics/microduck` 主仓，未翻查该组织下以 `elec_` 开头的硬件仓库。

但官方在 `microduck_rl` 里发布了完整的 **MJCF 仿真模型 + 47 个 STL 网格**。
MJCF 里包含了完整的运动学树：每个零件挂在谁身上、相对位置精确到 0.1mm、
绕哪根轴转、行程多少、质量和惯量张量。

**这些信息足以还原出装配关系。** 本仓库就是把它还原出来的结果。

---

## 两条路线，选一条走

本仓库同时覆盖两种舵机。**机械、电路、软件三层都有差别**，动手前先定：

| | 原版 · Dynamixel XL330 | 飞特 · HD-1910 |
|---|---|---|
| **舵机** | XL330-M288-T ×15 | HD-1910-C001 ×15 —— 便宜一半、力矩 2.5 倍 |
| **电压** | 额定 6 V，实跑 6.6–8.2 V，**超压 37%** | 额定 4–8.4 V，在额定内；但满电 8.4 V 顶格 |
| **打印件** | [CAD 仓库 · XL330 版](https://github.com/UnitClaw/microduck-replica-cad#两个版本选一个下) | [CAD 仓库 · 飞特版](https://github.com/UnitClaw/microduck-replica-cad#两个版本选一个下)，舵盘配合件不能混用 |
| **可编辑图纸** | [图纸仓 v1.1](https://github.com/fanhao375/microduck-replica-cad/releases/tag/v1.1) | [图纸仓 v2.1](https://github.com/fanhao375/microduck-replica-cad/releases/tag/v2.1)，文件带 `-FT` 后缀 |
| **电路** | 官方 HAT + [`imu_to_dxl`](hardware/imu_to_dxl/) | 同左；舵机连接器 2.0 mm（官方 2.5），`imu_to_dxl` 板上 J4/J5 是 2.0 |
| **软件** | 官方运行时直接跑 | 总线协议不同，要换协议模块 —— [适配架构分析](software/飞特适配架构.md)；策略要按 HD-1910 重训 —— [训练前数据清单](docs/HD-1910训练前数据清单.md) |
| **状态** | 纸上分析 + 首批打印件 | 已装机并站起（09-18）；Armbian + HAT 已读通 14 颗关节，保持姿势 3000 轮窗口无漏读，实际约 46.87 Hz；嘴部 ID 29 按用户要求排除，未验收；摄像头仅官方 B1 出图，Armbian 复测待完成 |

选型论证在 [执行器选型](docs/执行器选型.md)。本仓库主线走飞特；原版资料同样齐全，两条都能复刻。

---

## 📺 装配视频教程

**[B 站合集《MicroDuck 从零安装教程》](https://space.bilibili.com/312747174/lists/9279084?type=season)** —— 从零件清单讲起，一集装一个部件。共 8 集，截至 2026-10-12 已更新 6 集：

| 集 | 内容 | 时长 |
|---|---|---|
| [第 1 集](https://www.bilibili.com/video/BV1RoHX68EFV/) | 零件清单：头部、颈部、左右腿、脚掌各组件和舵机配件 | 1:32 |
| [第 2 集](https://www.bilibili.com/video/BV1Xppb6tECr/) | 小腿安装 | 2:21 |
| [第 3 集](https://www.bilibili.com/video/BV1ycpb6yEwB/) | 大腿安装 | 5:13 |
| [第 4 集](https://www.bilibili.com/video/BV1Kwpg6wE9G/) | 躯干组件安装 | 2:29 |
| [第 5 集](https://www.bilibili.com/video/BV1EEpg6nEkD/) | 颈部安装 | 0:40 |
| [第 6 集](https://www.bilibili.com/video/BV1aKpE6hEzj/) | 头部安装 | 5:50 |

打印件和外购件按 [CAD 仓库](https://github.com/UnitClaw/microduck-replica-cad)里的装配 BOM 备齐再开装。联系我们：

<table align="center">
<tr>
<td align="center"><a href="https://www.wwntai.com"><b>官网</b></a><br><sub>www.wwntai.com</sub></td>
<td align="center"><a href="https://wwnt.ai"><b>国际站</b></a><br><sub>wwnt.ai</sub></td>
<td align="center"><a href="mailto:Support@wwntai.com"><b>邮箱</b></a><br><sub>Support@wwntai.com</sub></td>
</tr>
</table>

## 交流群

有人在做同样的事，凑了个微信群一起讨论复刻进度、踩过的坑、元件采购。

下面是**鸭子复刻群 11**的二维码（微信群满 200 人后无法扫码加入）。

<div align="center">
  <img src="assets/wechat-group-11.png" alt="鸭子复刻群 11 微信二维码" width="280">
  <br>
  <sub><b>鸭子复刻群 11 · 二维码有效期到 2026-10-29</b>（微信群码 7 天自动失效）<br>
  过期了请开个 <a href="https://github.com/UnitClaw/microduck-replica/issues">issue</a> 说一声，我会换上新的</sub>
</div>

## 现在做到哪了

按日期的更新记录在下面的[最近更新](#最近更新)。

<table>
<tr>
<td width="50%" valign="top">

### 🔌 电气 · IMU 修好能走了，新版三块板画好了（2026-10）

<p align="center"><a href="assets/走路-2026-10-15.mp4"><img src="assets/走路-2026-10-15.gif" alt="2026-10-15：修好 IMU 以后在木地板上走（点开看 5 秒视频）" width="220"></a></p>

以前一推摇杆走两三步就摔，根因是 BNO085 芯片自己算的姿态走路时会乱跳。robotd 改成用芯片的陀螺自己积分姿态以后，这样走推摇杆 60 秒一次没摔（kissqy V167 + 我们的 fork，舵机全默认，硅胶脚）。转向还弱，正在调。**[怎么查出来、怎么修的](docs/HD1910-20261015-IMU乱跳根因与陀螺融合上机.md)**。

**新版自制板 · 三块画好了（2026-10，还没打样实测）**：嘉立创 EDA 专业版工程和整板 3D（给机械对结构）都在 **[`hardware/新版/`](hardware/新版/)**，Gerber、BOM、接线表还没出。

- **总线 IMU 板 v2**：跟舵机走同一条总线的 IMU 小板（LSM6DSV16X + STM32G031），电路照老版重新布局；舵机座换成能插飞特线的 A2007WR-3P，去掉外部晶振，总线串联电阻改成 0 Ω，固件 0.2.0 不用改。布线完成；到货先量总线低电平，IMU 芯片转了 180°，装上鸭子要重定安装方向。
- **舵机总线 HUB**：电池进线 + 总线分线，只有连接器（1.2 mm 3P ×2，2.0 mm 3P 弯插、直插各 ×2）。还没打样；电池端子 CN1 高 8.4 mm 跟结构干涉，要换矮的。
- **接电池板**：两个香蕉座 + 两块焊线盘，39 × 6.8 mm。孔、焊盘、走线按参考板改完，还没打样。

HUB 和 IMU 板的脚序对得上，同向线直连。

**更早：09-18 第一次上电**（[30 秒视频](assets/首次上电-2026-09-18.mp4)）

装好的鸭子第一次接总线：URT-2 走 USB、7.4 V 进 V1，**15 颗 HD-1910 全部在线，0 超时 0 校验错**，一次同步读 15 颗 4.8 ms。
用仓库里新写的[网页调试台](tools/servo-web/)拖滑块、存姿态、跑序列，3D 模型跟着真机动，重心投影实时显示在不在脚底范围。
视频里是它从缩着**自己站起来**再坐下。**飞特路线的软件第一步走通了**，硬件方案没问题。

以上是 09-18 的上电记录。09-28 早期本机原 ID 21 损坏，嘴 ID 34 的舵机挪作 ID 21，用户确认 FD 校中位到 2048；随后用户将嘴部 ID 设为 29，扫描曾识别其固件/型号。本轮只测试 14 颗关节，嘴 29 按用户要求排除、未验收，不能沿用“15 颗全在线”作为当前验收结论。`imu_to_dxl` 已有飞特协议 [0.2.0 固件](hardware/imu_to_dxl/firmware/)，真总线仍待测。

**[网页调试台](tools/servo-web/)**　·　
**[调试记录](调试记录.md)**（零位、方向、站姿的坑）　·　
[踩坑记录](踩坑记录.md#工具)（URT-2 先插 USB 再上电）　·　
[飞特适配架构](software/飞特适配架构.md)

</td>
<td width="50%" valign="top">

### 🔨 机械 · 飞特 HD-1910 版装出来了

<a href="构建日志.md"><img src="build-log/photos/2026-09-13-飞特版装机-正面.jpg" alt="飞特 HD-1910 版装机实物"></a>

**15 颗飞特 HD-1910 全部配好 ID、装进机身。** 这不是官方的 XL330 —— 便宜一半、力矩大 2.5 倍、
电压额定匹配，是[执行器选型](docs/执行器选型.md)里论证的那条路，现在有实物了。

**HD-1910 的舵盘是凸的，XL330 是凹的**，跟舵盘配合的 8 个件同事全改了、重新打印。
可编辑的 SolidWorks 图纸也出了飞特版（`-FT` 后缀），改了什么、为什么，
在图纸仓里写清楚了。

**从零装一只的视频教程**也在出：[B 站合集](https://space.bilibili.com/312747174/lists/9279084?type=season)，已更新到第 6 集（头部）。

**[装配视频教程](#-装配视频教程)**　·
**[构建日志](构建日志.md)**　·
**[飞特版 SolidWorks 图纸](https://github.com/UnitClaw/microduck-replica-cad)**　·
**[模型与打印文件](https://github.com/UnitClaw/microduck-replica-cad)**　·
**[BOM 清单 · 带采购链接](https://github.com/UnitClaw/microduck-replica-cad#装配-bom)**　·
[调试记录](调试记录.md)　·
[打印入口](print/)
</td>
</tr>
<tr>
<td width="50%" valign="top">

### 💻 软件 · Studio 网页中控 + 复刻镜像（2026-10-20）

<p align="center"><a href="software/studio/"><img src="assets/studio-overview.png" alt="Microduck Studio 总览：3D 鸭子、电池、舵机、IMU、手柄、主板温度和上手清单" width="420"></a></p>

**Microduck Studio：装在鸭子上的网页中控，我们自己写的。** 电脑或手机浏览器打开 `http://<鸭子 IP>:8000/`，看状态、调舵机、配手柄、让它走，不用 SSH、不敲命令：

- **总览**：3D 鸭子跟着真机动；电池、舵机、IMU、手柄、主板温度一眼看完；右上角一键卸力（空格键也行）；
- **上手清单**：舵机零位 → IMU 方向 → 写进主程序 → 配手柄 → 测急停 → 站起来走几步，每一步告诉你现在该做什么；
- **舵机**：扫描 15 颗、拖滑块、单颗或一键中位校准、方向、P / D / 限力；
- **IMU**：先双手托着鸭子粗校，站起来以后再站着精校，算出 IMU 装的方向；
- **写进主程序**：零位、方向、IMU 方向一次写进主程序的标定，以后不开网页、开机直接用手柄也能走；
- **连 WiFi**（复刻镜像里才有）：鸭子连不上 WiFi 时自己开热点，手机连上在总览最上面填家里 WiFi；
- **手柄**：蓝牙手柄配对（走官方的配对流程）、网页手柄、测急停；
- **遥控**：站起来、开始走、坐下，技能和动作；
- **日志**：分类分级，出问题一键导出诊断包，发群里求助。

**复刻镜像（预发布，真机验收中）**：一张卡装好整套，包括我们 fork 的主程序、走路和动作模型、Studio，以及首次开机自动起名、认 IMU、开热点配网。烧卡 → 开机 → 手机连鸭子的热点 `Microduck-xxxx` → 在 Studio 里填家里 WiFi → 按上手清单走，全程不用 SSH。10-21 这一版改了新卡上测出来的问题：上手清单每一步都能跳过，跳过 IMU 也能走到运动模式，标定模式下也能「站姿使能」站着校 IMU，开着 Clash 也能打开 Studio，连完 WiFi 页面自己跳到新地址，「更多」页能自己定密码打开 SSH 或者登记钥匙；总线 IMU 也认本仓库自制的 imu_to_dxl 板。在二号鸭上从头走还没走完，先作为预发布放出：**[下载（Releases）](https://github.com/UnitClaw/microduck-replica/releases/tag/microduck-replica-image-20261021b)** · [烧录和第一次使用](software/image/烧录和第一次使用.md)。镜像免费，只供个人非商业复刻，不随收费产品分发（里面的模型是作者的个人非商业许可）。

**实测到哪了**：Studio 装在二号鸭上当开机服务用，手柄配对和急停实测通过；「写进主程序」、连 WiFi、复刻镜像还没在真机上验过，我们正在验。还没做的：网页上改走路手感参数。

主程序用我们的 fork [fanhao375/Microduck-kissqy](https://github.com/fanhao375/Microduck-kissqy)：IMU 模块（BNO085 / LSM6DSV16X）4 根线直接接主板 I²C，不用做总线 IMU 小板；用陀螺积分治好了走路时姿态乱跳。Studio 在它上面测过。

**[Studio 说明](software/studio/)**　·
**[复刻镜像](software/image/)**　·
[软件一览](software/)　·
**[装到鸭子上](software/studio/README.md#装到鸭子上)**　·
[台架模式：没装主控也能调舵机](software/studio/README.md#台架模式主控没烧用飞特调试板在电脑上调舵机)　·
[IMU 模块接线和安装](https://github.com/fanhao375/Microduck-kissqy/blob/hd1910-v167-trunk-imu-i2c/IMU-MODULE.md)　·
[老的网页调试台 servo-web](tools/servo-web/)　·
[飞特官方资料](docs/飞特资料/)（协议、内存表）

</td>
<td width="50%" valign="top">

### 🧠 算法 · 舵机参数与训练流程

采用 **[LuwuDynamics/xgoduck_rl](https://github.com/LuwuDynamics/xgoduck_rl) 公开的 1910 BAM M6 动力学参数**，
作为飞特版的仿真训练基线。感谢 LuwuDynamics 的分享；这份参数不是我们自行辨识的结果。
出处、固定版本、原文件校验值和 Apache-2.0 许可见[参数来源说明](docs/HD-1910-M6参数来源.md)。

**飞特官方也公开了 HD-1910 的 BAM**：[ftservo/ftservo-bam](https://gitee.com/ftservo/ftservo-bam)（Gitee，Apache-2.0），厂家自己辨识的参数和专门的控制模型，可以跟陆吾那份对比着选；我们还没验证哪份更准，接入时要注意的几点见[参数来源说明](docs/HD-1910-M6参数来源.md#飞特官方-hd-1910-bam)。

**具体训练流程推荐参考 [kissqy / Microduck-kissqy](https://github.com/kissqy/Microduck-kissqy)**，感谢 [@kissqy](https://github.com/kissqy) 的分享！
项目提供 HD1910 的训练中控与使用说明，涵盖训练环境准备、训练任务管理和 ONNX 模型导出，
并配套机器人中控、固件及演示视频。

完整训练工程已放入本仓库 **[`software/training/`](software/training/)**，一次克隆即可取得
代码、参数和仿真模型；[运行说明与初始化修复解释](software/training/docs/hd1910-baseline.md)给出具体命令。
训练沿用 [Pollen Robotics/microduck_rl](https://github.com/pollen-robotics/microduck_rl) 和
[Rhoban/BAM](https://github.com/Rhoban/bam)。已通过接入测试和短训练检查，尚无本机实测通过的走路策略。
实机测试仍需完成**零位、关节方向、IMU 和主控接入**，并核对本机质量惯量与舵机响应。

**[HD-1910 训练前数据清单](docs/HD-1910训练前数据清单.md)**　·
[执行器选型](docs/执行器选型.md)

</td>
</tr>
</table>

---

## 🔨 实物进度

> 本仓库反复强调「仿真 STL 不是可打印工程件」。**构建日志就是在验证这句话。**
> 结论会如实记录，无论正反。

**→ [构建日志](构建日志.md)**（机械）　·　**[调试记录](调试记录.md)**（电气与软件）　·　**[踩坑记录](踩坑记录.md)**

---

## 🦆 鸭友贡献

这个仓库不是一个人写的。合并进来的代码、实测验证过的结论，都记在这儿。

> **原作者**：本仓库源自 [@fanhao375](https://github.com/fanhao375) 的 [microduck-replica](https://github.com/fanhao375/microduck-replica) —— 逆向研究、装配图、爆炸图、硬件分析与文档的最初工作都由他完成；SolidWorks 图纸、装配 BOM 与装配视频由 **机械行者Robo** 建模整理。本仓库在其基础上继续维护。

| 谁 | 贡献了什么 |
|---|---|
| [@yoyojacky](https://github.com/yoyojacky) | **Rust 版飞特舵机测试工具**（[PR #27](https://github.com/UnitClaw/microduck-replica/pull/27)，已合并）。自己实现的最小 STS/SCS 协议（帧打包、校验和、ping、读写寄存器、状态解析），命令行可以扫描总线（带进度条）、读状态、转到指定位置、单颗测试和批量测试，输出位置偏差、峰值电流、峰值负载、电压温度并判定 PASS/FAIL。台架验收一条命令出汇总表 → [`tools/sts3215Servo_testtool/`](tools/sts3215Servo_testtool/) |
| [@Abo1ish](https://github.com/Abo1ish) | **IMU 小板固件 + 调试台姿态显示**（[PR #32](https://github.com/UnitClaw/microduck-replica/pull/32)，已合并）。给官方没开源的那块 imu_to_dxl 写了 STM32G031 固件底子，在实板上验证过，带主机端测试和一份写清楚边界的 [`VALIDATION.md`](hardware/imu_to_dxl/firmware/VALIDATION.md) → [`hardware/imu_to_dxl/firmware/`](hardware/imu_to_dxl/firmware/)；再用 J-Link 把 IMU 姿态实时读出来并进了网页调试台，3D 鸭子的躯干跟着真板子转（`--imu-jlink`，没板子也能用 `--imu-demo` 先看效果）→ [`tools/servo-web/`](tools/servo-web/) |
| 微信群的鸭友 | **Radxa Zero 3W V1.12J 的启动方案**。这批板子（WiFi 换成 AIC8800DS2）光换瑞莎引导还是起不来，他实测出设备树也得换成瑞莎 B1 的：**B1 引导 + B1 DTB + Armbian 6.1.115 内核 + Trixie 系统**，跑通了 → 写进了[踩坑记录](踩坑记录.md#软件)和[镜像使用说明](tools/radxa/镜像使用说明.md#6-如果你的板子不是这一批) |

### 鸭友的项目

有些鸭友是自己单独开仓库做的，不在这个仓库里，但跟鸭子直接相关、做得好的，放这儿推一下：

| 项目 | 作者 | 做什么的 |
|---|---|---|
| [microduck-color-studio](https://github.com/LathamZ/microduck-color-studio)（[在线试用](https://lathamz.github.io/microduck-color-studio/)） | [@LathamZ](https://github.com/LathamZ) | **鸭子的 3D 配色工作室，打印前先在网页里把颜色定好。** 70 个零件逐件上色，选材质（PLA / 哑光 / PETG / 金属 / 碳纤 / TPU）和灯光看效果；填上自己手里有哪些耗材，它按库存推荐配色（只用已有 / 补一色 / 丙烯点缀）。还能导入自己的 3MF（比如飞特版），导出**带颜色的多盘 3MF** 和按件拆好的 STL，拓竹 P1S / A1 mini / H2D 有预设。中英文界面，手机上也能看 |
| [MICDUCK_FTHD1901_REBUILD](https://github.com/fengj4780-sudo/MICDUCK_FTHD1901_REBUILD) | [@fengj4780-sudo](https://github.com/fengj4780-sudo) | **飞特版结构改进 + 可选 CNC 加强件。** 在我们的[可编辑 SolidWorks 图纸](https://github.com/UnitClaw/microduck-replica-cad)基础上接着改：适配飞特舵机（他仓库里写作 HD1901，零件文件用的是 HD-1910-C001），加强了薄弱件，修了装配干涉和几个破损的模型。腿部 **5 个零件可以换成 CNC 件**让受力更合理（还在打样测试，他估算 5 件含运费约 45 元）；不做 CNC 直接打印也行，强度也比原版好。附一键打印的 3MF（拓竹 H2D、0.4 mm、5 盘）和改好的 SolidWorks 图纸 |
| [Microduck-kissqy](https://github.com/kissqy/Microduck-kissqy) | [@kissqy](https://github.com/kissqy) | **飞特 HD1910 的训练流程与控制实现参考。** 提供训练中控、训练环境准备与任务管理说明、ONNX 模型导出，以及机器人中控、固件和演示视频；算法部分的具体训练流程推荐参考这个项目 |

做了跟鸭子有关的项目（工具、教程、改装、策略……），开 issue 贴个链接，我们加进来。

想加进来：直接开 [issue](https://github.com/UnitClaw/microduck-replica/issues) 或提 PR。
硬件、固件、算法、文档、实测数据都算 —— **实测数据尤其欢迎**，这个仓库的规矩是结论如实记录，无论正反。

---

## 最近更新

**2026-10-21 · 复刻镜像 20261021b（预发布）**：在 20261021 上加了几样：新卡第一次开机热点马上开（以前白等 45 秒）；「更多」页的 SSH 卡片能登记自己电脑的公钥，不开密码登录也能 SSH；双击上手清单的「跳过」不会再误点到「已完成」；总线 IMU 除了 kissqy 的 FT6 小板，也认本仓库自制的 imu_to_dxl 板（主程序把它排在一次读全身的最后，排第一会跟舵机撞包）。自制板另一版固件 1.0.0（带真舵机共线实测）放进了 [`hardware/imu_to_dxl/firmware-1.0.0/`](hardware/imu_to_dxl/firmware-1.0.0/)。[下载（Releases）](https://github.com/UnitClaw/microduck-replica/releases/tag/microduck-replica-image-20261021b) · [踩坑记录](踩坑记录.md)。

**2026-10-21 · 复刻镜像 20261021（预发布，替换 20261020）**：用新卡在二号鸭上从头走，测出一串问题，这一版都改了：fork 的标定模式一直报「启动中」，Studio 拿不到读数；上手清单不让跳；全点跳过以后进不了运动模式；标定模式下站不起来（fork 新加 `hold-home`，15 颗 3 秒一起转到站姿锁住，站着校 IMU 不用先切运动模式）；开着 Clash 时 `.local` 地址打不开；连完 WiFi 要自己换地址；SSH 主机钥匙没生成。另外 Studio「更多」页加了 **SSH 开关**：自己定一个密码打开，出了问题登进鸭子修，不用重烧卡（镜像不带任何人的钥匙，也没有默认密码）。**20261020 那版会卡在第 2 步，请换新版。** 标定模式站姿使能，以及「跳过 → 写进主程序 → 配手柄 → 走」这一段还没在真机上走完，验完转正式。[下载（Releases）](https://github.com/UnitClaw/microduck-replica/releases/tag/microduck-replica-image-20261021) · [烧录和第一次使用](software/image/烧录和第一次使用.md) · [踩坑记录](踩坑记录.md)。

**2026-10-20 · 复刻镜像第一版（预发布，待真机验收）**：一张卡装好整套（我们 fork 的主程序、走路和动作模型、Studio、首次开机和配网），烧卡开机后手机连鸭子的热点、在 Studio 里填家里 WiFi、按上手清单走，不用 SSH。第一版出来以后做了三路审查，发现新卡走不过「IMU 方向」和「写进主程序」两步：出厂时主程序该跑标定模式，镜像里却是运动模式。修好以后重出，先作为预发布放到 [Releases](https://github.com/UnitClaw/microduck-replica/releases/tag/microduck-replica-image-20261020)，真机验收过了转正式。[烧录和第一次使用](software/image/烧录和第一次使用.md) · [镜像构建脚本](software/image/)。

**2026-10-20 · 新版自制板三块画好了**：总线 IMU 板 v2（舵机座换成能插飞特线的 A2007WR-3P）、舵机总线 HUB、接电池板，嘉立创 EDA 工程和整板 3D 在 [`hardware/新版/`](hardware/新版/)，都还没打样实测。

**2026-10-20 · Microduck Studio 第一版：浏览器里的中控**：装在鸭子上的网页中控，我们自己写的。浏览器打开 `http://<鸭子 IP>:8000/`，就能看状态、一键卸力、标舵机零位、算 IMU 方向、写进主程序、配蓝牙手柄、测急停、让鸭子站起来走，按「上手清单」一步一步来，不用 SSH。已经装在二号鸭上当开机服务用，手柄配对和急停实测通过；「写进主程序」还没在真机上验过，网页上改走路参数还没做。[Studio 说明与安装](software/studio/)。

**2026-10-15 晚 · 「走两三步就摔」的根因找到了，鸭子能稳定走了**：BNO085 芯片自己算的姿态，走路时（多在落脚前后）20 ms 里跳 20～60°（陀螺说只转了 1～2°），模型以为自己在倒，一纠正就真倒了。我们在 robotd 里改成用芯片的陀螺自己积分姿态，芯片姿态差得少才慢慢跟、差得多就不信。实测：原来的模式推摇杆 9 s 摔 2 次；新模式推摇杆 60 s 一次没摔，在 walk 模式里待了 10 分多钟（推摇杆的 60 s）只摔 1 次，同时芯片照样跳了 745 次，模型那一路没跟着跳。没做完整的轮流对比（用户现场看了直接定用新模式），转向还很弱、整机偶尔重启，这两条还没解决。代码在 fork 分支 [`hd1910-v167-gyro-fusion`](https://github.com/fanhao375/Microduck-kissqy/tree/hd1910-v167-gyro-fusion)（默认仍是原来的模式，要自己切，见 [IMU-MODULE.md 4.4](https://github.com/fanhao375/Microduck-kissqy/blob/hd1910-v167-gyro-fusion/IMU-MODULE.md)）。[完整记录：现象、排查策略、分析、解决、上机数据](docs/HD1910-20261015-IMU乱跳根因与陀螺融合上机.md) · [踩坑记录](踩坑记录.md)。

**2026-10-14 晚 · kissqy 整套也能用 IMU 模块了（fork）**：kissqy 的一键整套只认舵机总线上的 IMU 小板，手上是现成 IMU 模块的用不了。我们给他的 robotd 加了「IMU 模块直接接主板 I²C」（BNO085 / LSM6DSV16X），公开在我们自己的 fork [fanhao375/Microduck-kissqy](https://github.com/fanhao375/Microduck-kissqy)（分支 `hd1910-v167-trunk-imu-i2c`，基于他 10-14 发的 V167）。**这不是 kissqy 的官方版本**，出了问题到本仓库反馈。BNO085 在我们第一台上跑过（V164 上）；合到 V167 以后只过了单元测试，**还没上真机**，LSM6DSV16X 也没上过真机，我们今晚在第一台上实测，结果会更新到这里。怎么接线、编译、用安装脚本装、确认 IMU 方向，见 [IMU-MODULE.md](https://github.com/fanhao375/Microduck-kissqy/blob/hd1910-v167-trunk-imu-i2c/IMU-MODULE.md)。顺带：kissqy 的 V167「修复鸭身抖动」是每次上力把舵机 D 写成 0、转矩限制写成 1000，跟我们 10-13 的结论一致；用 IMU 模块的鸭子**别直接点他中控的「安装 / 升级固件」**，会把 IMU 支持冲掉。

**2026-10-14 · 飞特官方 HD-1910 BAM 舵机模型**：飞特 9 月底在 Gitee 公开了 [ftservo/ftservo-bam](https://gitee.com/ftservo/ftservo-bam)（Apache-2.0，Rhoban/BAM 的派生），有 HD-1910 在 7.4 V 下辨识的 m1～m6 参数和专门的 HD-1910 控制模型。之前大家训练用的是陆吾（LuwuDynamics）公开的 1910 M6，现在多了一份厂家参数，可以对比着选。两份差别不小（电机电阻：飞特 2.97 Ω、陆吾 4.91 Ω；推算堵转力矩：飞特 1.37、陆吾 0.91 N·m），**我们还没在真机上验证哪份更准**。飞特的录数据脚本只设 P、不设 D，舵机多半是出厂 D=40，用它训的模型上机前先确认 D。加载、换算系数等接入细节见[两份参数对比与接入说明](docs/HD-1910-M6参数来源.md#飞特官方-hd-1910-bam)。

**2026-10-13 夜 · 掉电、舵机 D 与蹭地**：新旧卡都会在走路时整机掉电，是供电撑不住，不是软件。走路发颤跟舵机的 D（硬件阻尼）有关：训练用的舵机模型里没有 D，D 改成 0 后高频颤从 51% 降到 4～8%，我们现在用 P3 / D0 / 转矩限制 700。蹭地是两只脚都只抬了仿真的一半，D=0 后左脚还会脚尖朝下，下一步试 D=5～10。另外，kissqy 一键镜像（V164）不写 D 和转矩限制，中控里改了没效果。[完整记录](docs/HD1910-20261013-夜-掉电-舵机D与蹭地.md) · [软件从哪来、我们改了什么](docs/软件来源与我们的改动.md) · [步态分析脚本](tools/gait-analysis/)。

**2026-10-12 夜 · IMU 校准后站稳、开始迈步**：模型一接管就往后猛冲的根因找到了，是 **IMU 模块装歪了约 8.5°**。模型训练时站 HOME 机身是水平的，IMU 却一直说「前倾 8.5°」，模型就拼命往后救。用仿真按真机关节角算出「应有倾斜」，把偏差补进 IMU 安装参数后，模型接管 70 秒没倒、机身倾斜平均 0.2°，推摇杆两腿开始交替迈步（往前走了多少还没量）。顺带查清了网页手柄按了没反应的四层原因，改用蓝牙手柄直连。[完整记录与 IMU 零点校准方法](docs/HD1910-20261012-夜-IMU校准与首次迈步.md) · [分析脚本](tools/radxa/onboard-analysis/) · [踩坑记录](踩坑记录.md)。

**2026-10-12 · 主控配置勘误**：此前建议买 Radxa Zero 3W「2G / 16G eMMC」，**没必要，让大家多花了钱**。官方资料只写了 1 GB 内存、32 GB 存储；我们第一台就是 2G、无 eMMC、插 microSD 卡，跑 kissqy 整套实测只用了 175 MB 内存、3.3 GB 存储。复刻买 **1G 或 2G 的无 eMMC 版 + 32 GB microSD 卡**即可，只走官方渠道（安联新创淘宝店、瑞莎官方淘宝 / 京东店），别去小店多花几倍的钱。已经买了 2G/16G 的照样能用。[买哪个配置、去哪买](docs/电控采购清单.md#该买哪个配置)。

**2026-10-12 · 装配视频教程**：B 站更新《MicroDuck 从零安装教程》，已出零件清单、小腿、大腿、躯干、颈部、头部 6 集（共 8 集）。[分集目录](#-装配视频教程)。

**2026-09-29 · 镜像登录勘误**：旧公开镜像第一次用 **`root / 1234`** 登录；完成 Armbian 向导后才创建 `duck / duck1234` 并更换 root 密码，请随即修改默认密码。旧卡仍需补 `wlan0` DHCP。[使用说明](tools/radxa/镜像使用说明.md)已更正；当时另出过一版 DHCP 修复候选镜像。（10-21：9 月这两个底包镜像已从 Releases 撤下，现成的卡请用[复刻镜像](https://github.com/UnitClaw/microduck-replica/releases/latest)。）基础镜像不含机器人运行时或网页调试台。

**2026-09-28 · HAT 状态回读**：主板调试台已部署 **0.15.4**，修正同步读按返回 ID 归档的问题，目标回读频率为 50 Hz。保持现有姿势约 64 秒，14 颗各 **3000/3000** 有效，共 42000 条状态；此窗口 timeout、checksum、ID 错误均为 0，实际约 **46.87 Hz**。测试前后均已使能，目标与设置未变；这是状态采集，**尚未验收带 IMU、推理和动作写入的完整控制循环或步态**，其他时段仍有偶发缺应答。[测试范围与结果](tools/radxa/50Hz保持姿势读状态-20260928.md)。

**2026-09-28 · HAT 与摄像头调试**：HAT 已到货并与主板对插；Radxa Camera 8M219 起初在两个系统下都识别失败，调整排线正反面后，官方 B1 成功读到 IMX219 并采集 **40 帧、1920×1080** 图像。下一步换回原项目 Armbian 镜像，用正确接线复测；本次是短测，尚未验收持续帧率、HAT 全功能或整机行走。**[接线参考图与复测记录](tools/radxa/摄像头调试记录-20260928.md)** · **[踩坑记录](踩坑记录.md#主板--hat--摄像头)**。

**IMU 姿态接入调试台**：[`tools/servo-web/`](tools/servo-web/) 可选接入 J-Link，在同一个 3D 鸭子上显示舵机关节角与 IMU 躯干姿态。配套固件在 [`hardware/imu_to_dxl/firmware/`](hardware/imu_to_dxl/firmware/)，**0.2.0 已改成飞特协议**（ID 200、地址 56、15 字节），电脑上验收全过，等整机上真总线实测；没有 J-Link 也能用 ST-Link / DAPLink（`--imu-swd`）或直接走舵机总线（`--imu-bus`）看姿态。

---

## 装配爆炸图

![爆炸图](assembly-drawings/06_爆炸图_四分之三.png)

`assembly-drawings/` 下共 7 张：

| 文件 | 内容 |
|---|---|
| `01_正面` `02_侧面` `03_背面` `04_四分之三` | 装配完成态，原色 |
| **`05_爆炸图_侧面`** | 15 个部件沿运动链炸开，标注名称与质量 |
| **`06_爆炸图_四分之三`** | 立体视角，可看清左右腿镜像关系 |
| `07_分色对照_装配态` | 与爆炸图同配色的装配完成态，对照用 |

## 装配结构

```
躯干主体 199g
├─ 左髋 yaw→roll 23g → 左髋 roll 6g → 左大腿 48g → 左小腿 22g → 左踝+脚 30g
├─ 颈根 37g → 颈俯仰件 6g → 头 yaw/roll 机构 49g → 头部总成+喙 189g
└─ 右髋 yaw→roll 23g → 右髋 roll 6g → 右大腿 48g → 右小腿 22g → 右踝+脚 30g

整机 737.2g   外形 144 × 141 × 264 mm
```

躯干和头几乎一样重（199g vs 189g）——**头部占整机四分之一，重心很高**，
这解释了为什么它的行走策略难训。

## 关节参数

每条腿 5 个自由度，头颈 4 个 —— **14 个受控**。
整机实际装 **15 个 Dynamixel XL330**：第 15 个驱动喙/下颚，走被动连杆，不进动作空间。

| 关节 | 行程 |
|---|---|
| `hip_yaw` | -25° ~ +30° |
| `hip_roll` | ±22° |
| `hip_pitch` / `knee` / `ankle` / `head_pitch` | ±90° |
| `neck_pitch` | -90° ~ +60° |
| `head_yaw` | ±170° |
| `head_roll` | ±25° |

## 📋 物料清单（BOM）

**要买什么、买几个** —— [`BOM.md`](BOM.md)

整机 15 个舵机、14 个轴承、约 325 件紧固件、2 块要打样的电路板，数量取自上游 MJCF 的
引用计数（38 种网格 / 75 个实例），不是估的。含每块板的器件清单与立创编号。

> ⚠️ 里面有两条会让人买错的更正：**电池是 NP-F550 不是 F970**、**XL330 被超压运行**。

## 3D 打印件与 CAD 装配体

**统一到 [UnitClaw/microduck-replica-cad](https://github.com/UnitClaw/microduck-replica-cad) 下载。** SolidWorks、STEP、打印工程、装配 BOM 和安装说明在同一个仓库维护。

| 版本 | 截至 2026-09-28 的 CAD 发布 |
|---|---|
| 飞特 HD-1910 | [v2.1](https://github.com/fanhao375/microduck-replica-cad/releases/tag/v2.1) |
| Dynamixel XL330 | [v1.1](https://github.com/fanhao375/microduck-replica-cad/releases/tag/v1.1) |

本仓旧 `print/` 单件和 `cad/` 装配 STL 来自上游仿真模型，未同步实物改件，现已移除；这两个目录保留下载指引。**不要把飞特和 XL330 配合件混用，也不要把本仓训练/网页网格用于打印。**

CAD 仓库的 09-15 旧 3MF 尚未包含 v2.1 合体轮胎；请核对具体附件版本，详见 [打印说明](print/README.md)。图纸与说明书由 **WWNT Robotics** 建模整理，来源与许可见 CAD 仓库。装配过程可以对照[视频教程](#-装配视频教程)。

---

## 从运行时反推出的电控方案

<div align="center">
  <img src="assets/hw/01-物理布局.png" alt="Microduck 电控总览：板子都装在哪" width="880">
  <br>
  <sub><b>五个模块的物理布局</b> —— 灰色虚线框是物理区域，实线框是模块，红色虚线框表示装在壳体<b>外面</b>。<br>
  <b>橙色</b>是舵机总线（自上而下），<b>红色</b>是电池供电（自下而上）。<br>
  最容易搞错的一条：<b>主控、HAT、摄像头三者都在头里</b>，摄像头距主控板中心约 13 mm 且中间没有关节 ——<br>
  所以 MIPI 排线不穿过脖子，真正过颈的是舵机总线和供电线。<br>
  <a href="docs/硬件入门.md">完整图集与讲解 →</a>　·　<a href="assets/hw/Microduck硬件图集.pdf">下载 PDF 图集（7 张，A3）</a></sub>
</div>


**一条 1 Mbps 的 TTL 串行总线搞定一切。**

```
                Radxa Zero 3W (RK3566) · Armbian
                  ├── UART2  1 Mbps TTL 单线半双工 ── 15× XL330 + imu_to_dxl (ID 200)
                  ├── I2C3   400 kHz (pin 3/5) ────── AIC3104@0x18 · ToF@0x29 · BMI088（未用）
                  ├── I2S3   12.288 MHz ───────────── 音频
                  ├── MIPI CSI ────────────────────── IMX219（I2C@0x10，转 90°）
                  ├── 蓝牙 ────────────────────────── 手柄 / 手机 App
                  ├── Wi-Fi ───────────────────────── WebRTC
                  └── USB-C ───────────────────────── 供电 + maskrom
```

| | |
|---|---|
| **主控** | **Radxa Zero 3W** —— 市售模块，**不是定制载板** |
| SoC | RK3566，四核 Cortex-A55，Mali-G52，0.8 TOPS NPU。官方公布 1 GB 内存 / 32 GB 存储；复刻买 1G 或 2G 的**无 eMMC** 版 + 32 GB microSD 卡即可，只走官方渠道，见 [电控采购清单](docs/电控采购清单.md#该买哪个配置) |
| **舵机总线** | **单线半双工 TTL** —— **不是** RS-232，**也不是** RS-485。Dynamixel Protocol V2 @ 1 Mbps，走 `/dev/ttyS2` |
| **自制板 1** | **`imu_to_dxl` v2** —— 一颗会说 Dynamixel 的 LSM6DSV16X：总线 ID 200、寄存器 124，12 字节块在**同一次** `sync_read` 里和舵机一起读回 |
| **自制板 2** | **RPI Robot HAT** —— TLV320AIC3104 @ 0x18、一颗休眠的 BMI088、接 ToF 的 Stemma 座。**官方已开源**（[`elec_RPI_Robot_HAT`](https://github.com/pollen-robotics/elec_RPI_Robot_HAT)） |
| 电池 | 索尼 NP-F550，2S 锂电。**没有电量计，也没有 ADC** —— 电池电压是**读舵机上报的自身供电电压**得来的 |
| 传感器 | LSM6DSV16X IMU · VL53L5CX/L8CX 8×8 ToF · IMX219（树莓派 Camera v2） |

`imu_to_dxl` 是整套设计里最漂亮的一手：**IMU 不走 I²C**，而是把自己伪装成一个 Dynamixel 从机，
于是姿态数据和关节状态在同一次总线事务里回来 —— 不需要第二条总线，主机也不用跑姿态融合
（LSM6DSV16X 的片上 SFLP 块直接输出游戏旋转四元数，还自己估计陀螺零偏）。

**完整细节：** [硬件方案逆向](docs/硬件方案逆向.md) · [硬件规格速查](docs/硬件规格速查.md)

---

## 可行性：能造出来吗

**整机可复刻，卡点在成本不在技术。** 现状：

| 项目 | 状态 |
|---|---|
| 零件几何 | ✅ 47 个 STL |
| 装配关系 | ✅ 精确到 0.1mm，已出图 |
| 关节轴线 / 行程 | ✅ 14 个全有 |
| 质量 / 惯量 | ✅ 15 个刚体全有 |
| 舵机型号 | ✅ Dynamixel XL330 ×15 → [docs/执行器选型.md](docs/执行器选型.md) |
| 轴承 | ✅ Ø22×16×4 与 Ø15×10×3 |
| **HAT 板** | ✅ **官方 KiCad + Gerber + BOM 已开源**，直接打样 → [`elec_RPI_Robot_HAT`](https://github.com/pollen-robotics/elec_RPI_Robot_HAT) |
| **`imu_to_dxl` 板** | ⚠️ 未开源，需自绘；协议与寄存器布局已完整还原 → [docs/硬件方案逆向.md](docs/硬件方案逆向.md) |
| 主控 | ✅ **Radxa Zero 3W，市售模块**（此前误判为定制载板） |
| **紧固件清单** | ✅ 已从 STL 孔位反推 → [docs/紧固件反推.md](docs/紧固件反推.md) |
| 电池 / 传感器 | ✅ **NP-F550** 2S、IMX219、VL53L8CX、LSM6DSV16X |
| **走线方案** | ❌ 无 |
| **控制软件** | ✅ 主控用同款 Radxa Zero 3W 即可直接跑（Apache-2.0）；换主控才需移植 |
| **官方策略 ONNX** | ✅ 硬件保持同款即可直接用（9 个）；改动本体或电控才需重训 |

⚠️ **仿真 STL ≠ 可打印工程件。** 仿真只关心外形与惯量，不保证配合公差、
螺纹孔、热熔螺母座和走线空间。直接打印大概率装不起来，需要自行补充工程细节。

💰 **自己造大概率比买贵，但差多少全看渠道。** 15 个 XL330 在 ROBOTIS 国际站约 **$359**、
美国站 **$412**、欧洲含税 **€603–629** —— 也就是从「略低于整机售价」到「远超」都有可能。
加上主控、电池、两块板打样和打印耗材必然更贵。完整核价见 [BOM.md](BOM.md)。

## 现实路径

放弃 100% 复刻（`imu_to_dxl` 板与可编辑机械 CAD 未开源），改成**机械照抄 + 电控自建**：

| | 方案 |
|---|---|
| 机械 | 到 [CAD 仓库](https://github.com/UnitClaw/microduck-replica-cad) 选择对应舵机版本的模型与装配说明 |
| 舵机 | XL330 × 15，市售件照买 |
| 主控 | **Radxa Zero 3W**，市售模块，与官方同款 |
| IMU 板 | 自己画 `imu_to_dxl`：LSM6DSV16X + MCU + 半双工收发器，协议已还原 |
| HAT 板 | **官方 Gerber 直接打样**（4 层板）。不要录音可整块省略，但**半双工方向电路要另配转接板**，见 [电控采购清单](docs/电控采购清单.md#六两块-pcb) |
| 软件 | 主控同款则官方 Rust 运行时可直接跑（Apache-2.0） |
| 策略 | 官方 9 个 ONNX 可用；改硬件后用 [microduck_rl](https://github.com/pollen-robotics/microduck_rl) 重训 |

**结论已从「机械可抄、电控是硬墙」修正为「整机可复刻」** ——
主控是市售模块，自制板的功能和协议已从源码完整还原。
详见 [docs/硬件方案逆向.md](docs/硬件方案逆向.md)。

---

## 三个必踩的坑

1. **Armbian 默认在 UART2 上跑登录控制台。** `serial-getty@ttyS2` 占着串口，
   必须 `systemctl mask` 掉。Pollen 是用 `fuser -v /dev/ttyS2` 查出来的。
2. **i2c3 和 FUSB302 抢引脚。** 用排针 pin 3/5 的硬件 I²C，代价是**失去 USB-C PD 协商**
   （普通 5V 充电仍然可用）。
3. **NPU 出厂是关的。** Armbian 默认禁用，要跑 RKNN 模型得刷 overlay 并重启。

---

## 生态导航

Microduck 的东西散在 GitHub 多个组织和 HuggingFace 三种资源里，**官方硬件仓库尤其容易漏**。
[`docs/生态导航.md`](docs/生态导航.md) 把官方仓库、模拟器、策略模型、数据集、社区项目
逐个标注了「是什么、能拿来干嘛」。

## 深入文档

| 文档 | 内容 |
|---|---|
| [紧固件反推](docs/紧固件反推.md)（[English](docs/fastener-reconstruction.en.md)） | 从 47 个 STL 扫描孔特征，反推出 M2 螺丝系统与采购量 |
| [执行器选型](docs/执行器选型.md)（[English](docs/actuator-selection.en.md)） | XL330 参数、BAM M6 配置、5 组标定 PD、回差建模；**为什么不能换闭环步进、换 STS3215 会怎样**（737g vs 2107g 实测对照）、**同级别舵机横向对比**（含宇树 S288 深度评估） |
| [**踩坑记录**](踩坑记录.md) | **上手前扫一遍** —— 买东西 / 打板 / 飞线 / 软件 / 工具，每条三句：现象、原因、怎么办 |
| [**调试记录**](调试记录.md) | **拿到货一步一步做** —— 舵机配 ID 改哪些参数（含 ID 对照表）、怎么供电，后面按日期记过程 |
| [**HD-1910 训练前数据清单**](docs/HD-1910训练前数据清单.md) | **给算法重训用的** —— 几何、质量惯量、关节标定、舵机规格、IMU 安装，仓库有的全填了并标出处，台架实测项列了怎么测 |
| [**不打 HAT**](docs/不打HAT.md) | **HAT 打样太贵？** ¥70 的降压模块 + 半双工转接板飞线替代，一步一步接，哪步会烧东西 |
| [**硬件入门**](docs/硬件入门.md) | **一块板一块板讲清楚** —— 五个模块各自干嘛、一个 tick 里信号怎么流、走飞特路线哪些会变，末尾附「复刻前必做的五件核对」 |
| [**硬件规格速查**](docs/硬件规格速查.md) | **一页纸规格表** —— 系统框图、芯片型号、总线参数、复刻清单、必踩的坑 |
| [硬件方案逆向](docs/硬件方案逆向.md) | 完整推导过程与证据出处（[English](docs/hardware-teardown.en.md)） |
| [**电控采购清单**](docs/电控采购清单.md) | **淘宝实链** —— 主控 / 摄像头 / ToF / 电源 / 两块 PCB / 线材与调试板，含选型推算与避坑（2026-09-04 快照） |
| [**机械采购清单**](docs/机械采购清单.md) | **淘宝实链** —— 轴承 / M2 紧固件 / 热熔螺母与压头 / 螺纹胶 / 耗材 |
| [社区动态](docs/社区动态.md) | X / GitHub 情报，含外部验证、噪音与风险提示 |

结论速览：**整机是 M2 螺丝系统**（Ø2.2 过孔 ×77 + Ø4.4 沉头孔 ×28 + Ø1.6 攻丝底孔 ×20），
结构件过孔约 146 个；轴承 Ø22×16×4 与 Ø15×10×3。

---

## 重现

```bash
# 1. 为下列装配图生成脚本拉取上游（训练工程已在 software/training/，无需此步骤）
bash scripts/fetch_upstream.sh

# 2. 重新生成装配图
python scripts/render_assembly.py upstream/microduck_rl assembly-drawings

# 3. 导出上游装配分析预览（不作为实物打印件）
python scripts/export_assembly_stl.py upstream/microduck_rl analysis-output/cad-upstream

# 4. 重新扫描孔特征
python scripts/analyze_holes.py upstream/microduck_rl/src/mjlab_microduck/robot/microduck/assets
```

依赖：`mujoco` `numpy` `pillow` `scipy`。渲染需要可用的 OpenGL 上下文。

---

## 许可证

- `scripts/`、`software/studio/` 的代码、`software/image/` —— Apache-2.0
- 复刻镜像里的走路和动作模型不在本仓库，适用模型作者的个人非商业许可，**镜像不得随收费产品分发**（见[模型说明](software/image/overlay/usr/share/doc/microduck/模型说明.txt)）
- `assembly-drawings/` 及保留的仿真网格 —— **CC BY-SA-NC 4.0**（上游 3D 模型为 CC BY-SA-NC，
  依 ShareAlike 条款衍生作品须沿用同协议，**不得商用**）

详见 [NOTICE.md](NOTICE.md)。本项目与 Pollen Robotics 无隶属关系，未获其背书。
