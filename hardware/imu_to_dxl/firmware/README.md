# imu_to_dxl 固件 0.2.0

用于队友自制的 **STM32G031F8P6 + LSM6DSV16X** 板。硬件基线为
`UnitClaw/microduck-replica` 的 `a1f4979c425bd9228622be89f2bfa4d1de7fbde3`
（2026-09-08，含 J4/J5 和 RX_EN）。2026-09-20 已完成首次实板启动：J-Link SWD 连接、
固件烧录读回校验、Keil 停在 `main`、64MHz 时钟及 IMU 采样均已验证。
短测中 IMU 标识为 `0x70`、ready=1、SPI/FIFO 错误为0；外部总线和舵机尚未实测。

**0.2.0（2026-09-22）把总线协议换成飞特 SCS/STS**，逐条按[总线协议](../总线协议.md)实现：ID 200、地址 56 的 15 字节块、sync_read 排队。IMU、板级和 Keil 工程未改。电脑上的主机测试和「真协议代码上模拟总线」的验收（`Tests/bus_sim_test.py`，用 [`tools/imu200`](../../../tools/imu200) 的 `check` 判据）全部通过；已烧进原开发板，IMU 照常工作。**真总线和舵机尚未实测。**
构建、桌面测试与首次实板验证的边界见 [VALIDATION.md](VALIDATION.md)。

本目录与原理图、PCB 放在一起，提供源码、Keil 工程及唯一保留的预编译产物
[`Build/imu_to_dxl.hex`](Build/imu_to_dxl.hex)。串口调试台 [`tools/servo-web`](../../../tools/servo-web)能在同一个网页中叠加舵机关节角和 IMU 躯干姿态，三种读法：`--imu-bus`（舵机总线，跟主控同一条 sync_read）、`--imu-swd`（ST-Link / DAPLink）、`--imu-jlink`（J-Link）。

SWD / J-Link 观察器从 HEX 解码 `0x08000000` 起的 **10,724 字节** Flash 镜像，检查 SHA-256
`66bc7c532f5a1ad87e3dfff71a4b51f8c4f20840a8f62436874fa5b7c665938e`，并校验板上镜像。
只有这个基线可使用已审核的 RAM 布局：`sample=0x2000006C`（60 字节）、
`tick=0x20000A34`（4 字节），按 0.2.0 的 MAP 核对过。仅使用姿态网页无需重新编译；改动固件后需重新审核
Flash 校验值及这两个符号的地址、大小，不能沿用旧地址读取新程序。

源码断点调试需在自己的环境重新构建 `.axf`；构建仍生成 `.map`、`.bin` 供开发时复核，
这些文件及测试产物由 `.gitignore` 排除，不提交到仓库。

数据流：LSM6DSV16X → SPI1 → STM32 → USART2 + 外部缓冲 → 单线半双工总线 → Linux 主控。
实现**飞特 SCS/STS 协议，ID 200，1Mbps**，在舵机总线上冒充一颗舵机（0.1.0 是 Dynamixel Protocol 2.0）。
代码不驱动舵机运动，不写 MCU Option Bytes，不写固件配置到 Flash。

**真总线验收**：接上半双工适配器（URT-2）跑 `python tools/imu200/imu200.py check --port COMx`，13 项判据照主控源码写，过了才能上整机。电气检查（DE 释放、电平、T_resp 实测）仍需逻辑分析仪。

## 1. 直接开始

### Keil

1. 使用 J-Link 时，打开 `MDK-ARM/imu_to_dxl_jlink.uvprojx`。
2. 在自己的 Keil 中选择已合法安装的 Arm Compiler 6（验证过 6.24 和 6.22；MDK 5.24 这类带 6.7 的老版本编不了，CMSIS 6 头文件要求 ≥ 6.10，会报 `cmsis_clang.h` 找不到）和 `STM32G031F8Px` 器件包。
3. 按 **F7** 编译；`Build/imu_to_dxl.hex` 为烧录文件，`.axf` 用于源码断点调试。
4. 在 Debug → Settings 中选择自己的 J-Link，核对 SWD、STM32G0xx 64KB Flash 算法和 Run to main。
   `JLinkSettings.JLinkScript` 在连接和复位后将传输速度设为 **100kHz**；保留此文件。
   首板曾在 4MHz 下载时出现数据传输失败，初次连接建议先使用已验证的 100kHz。
5. 按 **Ctrl+F5** 进入调试并停在 `main`；**F10** 单步跳过、**F11** 单步进入、**F5** 运行。
   暂停会改变采样和总线时序，连续通信测试时全速运行。

原 `MDK-ARM/imu_to_dxl.uvprojx` 的 ST-LINK 配置保留。更换 J-Link 时，应在 Debug → Settings
重新选择探针。

### VS Code

用 VS Code 打开这个文件夹编辑源码，在集成终端执行下面的构建命令。
该路线使用 VS Code 编辑、Keil 编译与硬件调试；不需要再安装 CubeMX、CubeIDE 或 GCC 才能构建。
源码自带必要 CMSIS 头文件和 ST IMU 驱动，首次构建无需联网下载依赖。

也可以在本目录的 PowerShell 终端执行：

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\Tools\build.ps1
```

编译器默认路径 `E:\Keil_v5\ARM\ARMCLANG` 仅为示例。其他电脑用 `-ToolchainRoot` 指定已合法安装的 Arm Compiler。
构建临时目录位于本工程 `Build` 下；操作系统和已有工具的授权缓存仍由各软件管理。
构建会替换 `Build` 中的预编译固件；如需保持网页的已验证基线，请先保留原始产物。

## 2. 工程内容

| 文件 | 内容 |
|---|---|
| `Core/Inc/board_config.h` | 集中的板级开关、时钟、波特率、SPI 速率 |
| `Core/Src/board.c` | 时钟、GPIO、SPI、USART、SWD 保留、毫秒/微秒时基、看门狗 |
| `Core/Src/imu.c` | 身份检查、初始化回读、FIFO、原始加速度/陀螺仪、SFLP、故障重试 |
| `Core/Src/protocol.c` | 飞特 SCS/STS 从机：帧解析（按校验和重同步）、各指令应答、sync_read 排队、应答时序 |
| `Core/Src/control_table.c` | 地址 56 的 15 字节块、状态位、诊断寄存器 |
| `Core/Src/main.c` | 主循环调度、串口命令及状态日志 |
| `Drivers/` | 固定版本的 ST/CMSIS 源码与许可证 |
| `MDK-ARM/` | Keil 工程、链接布局和 J-Link 低速连接脚本 |
| `Tests/` | 无板可运行的协议、模拟传感器、寄存器测试；`bus_sim_test.py` 把真协议代码编成 DLL 挂到模拟总线上跑验收 |

无动态内存，无 RTOS，无 HAL 依赖。板级代码使用 ST 官方 CMSIS 寄存器定义；传感器使用官方平台无关驱动。
STM32 的外部总线接收使用中断环形队列，每字节保存接收时刻；协议、采样和日志格式化运行在主循环。
日志发送另用中断队列，不阻塞总线接收。

## 3. 默认硬件配置

| 功能 | 芯片引脚 / 配置 |
|---|---|
| MCU | STM32G031F8P6，TSSOP20，64KB Flash / 8KB RAM |
| 系统时钟 | HSI16 → PLL，M=1、N=8、R=2，64MHz，Flash 2 wait states |
| 外部时钟选项 | `BOARD_USE_HSE_BYPASS=1`，X1 16MHz 有源时钟接封装脚2；启动失败退回 HSI 路线并记录状态 |
| IMU SPI | SPI1 mode3、8bit、软件 CS；64MHz 下 2MHz；PA4=CS、PA5=SCK、PA6=MISO、PA7=MOSI |
| IMU INT | 首版轮询 FIFO，PA0/封装脚15中断信号暂不使用 |
| 总线串口 | USART2，PA2=TX、PA3=RX，AF1，1Mbps、8N1；不启用 USART 单引脚 HDSEL |
| 总线 DE | PA1 → U3.1 `1OE#`，**低有效**；GPIO 控制，等 USART TC 后才释放 |
| 总线 RX_EN | PB7 → U3.7 `2OE`，**高有效**；发送期间关闭、PA3 上拉；同封装脚 PB8 保持模拟输入 |
| 调试串口 | USART1，PA9/PA10 经 SYSCFG 重映射到封装脚16/17，115200、8N1；`BOARD_LOG_UART_SWAP=0` |
| SWD | PA13=SWDIO、PA14=SWCLK，保留复位默认调试功能 |
| 看门狗 | 默认开启，约2秒，LSI 误差影响实际时长；调试器暂停时冻结 |

PLL 启动异常时会保留 HSI16 运行，串口 BRR 和计时器按实际主频计算。此时 SPI 也降为 0.5MHz，
服务延迟会增加，属于故障诊断模式，应检查时钟状态，不作为完成性能验收的配置。

### J3 接线必须以[原理图 PDF](../imu_to_dxl-原理图.pdf)和实板网络为准

| J3 脚号 | 最新原理图信号 | 接法 |
|---|---|---|
| 1 | GND | J-Link/ST-LINK/USB-TTL 共地 |
| 2 | SWDCLK | J-Link/ST-LINK SWCLK |
| 3 | SWDIO | J-Link/ST-LINK SWDIO |
| 4 | UART_RX，U1封装脚17 | USB-TTL TX，3.3V 电平 |
| 5 | UART_TX，U1封装脚16 | USB-TTL RX，3.3V 电平 |
| 6 | 3.3V | 调试器电压参考；不要把 5V 接到这里 |

J3 的 SWD 四根线使用 **1、2、3、6** 脚；不要将旧的四针排线整排插到1–4脚，
第4脚是串口输入，不能当作供电或电压参考。首次上电先按焊盘/EDA 网络核实。
J3 没有引出 NRST；如需 under-reset 连接，需在实际 NRST 测点另接。
调试器若带电源输出，不要与另一电源盲目并联；先确认它是 VTref 输入还是电源输出。

J1/J2：1=GND、2=VDD_BUS、3=DATA；J4/J5：1=DATA、2=VDD_BUS、3=GND。
总线测试需要单线半双工 USB 适配器；普通 USB-TTL 仅用于 J3 日志。

## 4. IMU 行为

- WHO_AM_I 应为 `0x70`。软件复位后按步骤配置，并回读 ODR、量程及 SFLP 使能。
- 加速度 ±4g，0.122mg/LSB；陀螺仪 ±500dps，17.5mdps/LSB。
- 加速度、陀螺仪、SFLP 和 FIFO 批处理均为120Hz，供50Hz主控读取。
- FIFO 按标签区分加速度、陀螺仪和四元数；每轮最多16条，不假设三者在同一条记录中。
- 初始化、SPI 失败、FIFO 溢出或数据过期时 `ready=0`；约1秒后自动重试。
- gyro 或 quaternion 任一超过100ms未更新即失效。即使主循环忙、未执行采样轮询，读取快照也会再次检查年龄。
- 读取接口保持一致快照，不在中断里更新姿态。传感器安装旋转留给主控，避免与官方坐标变换重复。
- 本版不保存实测偏置；SFLP 从上电默认状态开始估计。六轴姿态不提供绝对航向参考。

合法的单位姿态 `xyz=0,0,0` 与上游全零“未就绪”哨兵重合。已收到有效 FIFO 姿态时，仅将 x 的半精度
编码设为 IEEE 负零 `0x8000`，数学数值仍为0；真正未就绪始终返回全零。详见驱动说明和回归测试。

**运行时故障处理边界：** 已检查的官方主控在收到全零姿态后可能保留上次姿态，其 `ready()` 不会因此自动撤销。
正式站立/运动联调前，主控应额外读取本版诊断 `ready`、采样计数和年龄，并执行失效处理。
本版 PC 采集脚本已经读取这些字段；不能把“单板返回全零”当作整机已经具备自动停车行为。

## 5. 通信与寄存器

帧格式 `FF FF ID LEN INSTR 参数… CHK`，`CHK = ~(ID+LEN+INSTR+Σ参数)`，没有字节填充，所以载荷里也会出现 `FF FF`：接收按长度收完再验校验和，校验错就丢一个字节重新找帧头，不会被载荷里的假帧头带偏。逐条行为见[总线协议 §8](../总线协议.md#8-其它指令怎么应答)：

| 指令 | 行为 |
|---|---|
| `SYNC_READ 0x82`（广播） | 自己在列表第 k 位：k=0 收完指令 50 µs 后发；k>0 等前面 k 个设备的应答帧（ID 在前面、长度对、第 5 字节不是指令码），前面有设备 1 ms 不出声就当它不在线跳过 |
| `PING` / `READ`（单播） | 回状态帧 / 数据，ERROR 恒为 0；广播 PING 不答 |
| `WRITE` / `REG_WRITE`（单播） | 回 ACK，内容一概忽略（主控从不写这块板） |
| `ACTION` `0x06` `0x09` `0x0A` `0x0B`（单播） | ACK，不动作 |
| `REBOOT 0x08` | 不答，真重启 |
| `SYNC_WRITE`、别的广播 | 不答 |

时序（全是推断值，待实测，见总线协议 §5/§12；50 µs 是协议逻辑里的数，加上解析和组包的 CPU 时间后真实值要逻辑分析仪量）：T_resp 50 µs；帧内字节间隙超过 500 µs 丢弃残帧；排队时总线静默 1 ms 认为前一个设备不在线；等不到轮次 25 ms 放弃；到点后晚 2 ms 还发不出去就放弃，避免在下一笔事务里抢总线。发送前再次原子检查新到达的 RX 数据、USART BUSY 和故障标志；忙时放弃这次应答。
接收中断里只有**溢出（ORE）**才当总线故障清空收包；噪声 / 帧错标志只计数，字节照收，错了由校验和丢掉 —— 0.1.0 一律清空，一个字节带噪声标志就会把整条 sync_read 扔掉、这一 tick 15 颗舵机跟着丢（0.2.0 审查后改）。

**把 ID200 放在 Sync Read 列表第一位**，与官方 `bus.rs` 相同；放中间也能答（排队规则），但前面的设备缺席时主控侧的解析会错位，见总线协议 §2。

多字节字段全部小端。

| 地址 | 字节数 | 内容 / 权限 |
|---|---:|---|
| 0 / 1 | 各1 | 固件版本 0.2（主.次），不冒充舵机的 3.46 |
| 2 | 1 | END = 0（小端） |
| 3 | 2 | 自定义型号 `0x4D44` |
| 5 / 6 / 8 | 各1 | ID 200 / 波特率 0（1Mbps）/ 应答状态级别 1 |
| **56** | **15** | **主控每 tick 读的块**：gyro XYZ（int16，17.5 mdps/LSB）、四元数 XYZ（binary16）、采样计数（u8）、状态位、保留 0。原始轴序，不做坐标变换 |
| 124 | 6 | gyro XYZ，三个 int16，±500dps（诊断，跟块里同一份） |
| 130 | 6 | quaternion XYZ，三个 IEEE binary16；W由主控重建 |
| 136 | 6 | 原始加速度 XYZ，三个 int16，±4g |
| 142 | 1 | 姿态采样计数低8位 |
| 143 | 1 | bit0=ready、bit1=configured、bit2=error |
| 144 / 145 | 各1 | WHO_AM_I / 错误码 |
| 146 / 147 | 各1 | 时钟状态 / 看门狗开关 |
| 148 / 152 / 156 | 各4 | 姿态 / gyro / accel 采样计数 |
| 160 / 164 / 168 | 各4 | uptime_ms / gyro年龄ms / 姿态年龄ms |
| 172 / 176 / 180 / 184 | 各4 | SPI错误 / FIFO溢出 / 非法四元数 / 恢复次数 |
| 188 / 192 / 196 / 200 | 各4 | RX队列溢出 / UART错误（噪声/帧错/溢出都计）/ 校验和错误 / 非法包 |
| 204 / 208 / 212 / 216 | 各4 | 收包超时 / 有效收包数 / 实际发包数 / 取消应答数 |
| 220 / 224 / 228 / 232 | 各4 | RCC复位原因原值 / 主频Hz / TX超时 / 日志丢弃数 |
| 236 | 1 | 本项目诊断寄存器表版本 2（飞特协议，块在 56） |
| 240 | 4 | sync_read 排队时判定前面设备不在线、跳过的次数 |
| 244 | 4 | 发送前检测到总线忙而放弃应答的次数 |

其余 0~255 地址读为 0；写一律 ACK 但不生效（重新初始化 IMU 改用 J3 日志串口的 `r` 命令）。56~70 是主控接口；124 及之后是**本项目自定义诊断扩展**，不宣称与舵机的电压/温度寄存器兼容。

块里的状态位（byte 13）：BIT0 融合没就绪（四元数全 0）；BIT1 跟 IMU 通信失败（SPI/复位超时/配置/数据过期/FIFO）；BIT2 自检失败（WHO_AM_I 不对）；BIT3 两次读块之间刷新了 4 次以上（120 Hz 采样、50 Hz 读每次正常 2~3 次）。
错误码见 `imu.h`：0正常、1启动、2SPI、3身份、4复位超时、5配置、6过期、7FIFO、8四元数。
时钟状态：0=HSI PLL、1=HSE PLL、2=HSE失败回退HSI PLL、3=PLL失败HSI16、4=切换失败回退。

## 6. 板到后的顺序

1. 核实硬件版本、J3方向及电源，先单板限流上电，检查3.3V、短路、发热和复位。
2. SWD识别 STM32，下载 HEX，确认 main 可断点、复位和断电重启都可启动。
3. 接 J3 日志串口，115200/8N1。应有版本信息；每秒输出 ready、id、错误和数据。
   `s`打印状态，`l`切换周期日志，`r`重新初始化IMU，`?`查看帮助。
4. 检查 WHO_AM_I=0x70、ready=1、采样计数增长，翻面/转动三轴核对加速度及姿态方向。
5. 只接 IMU 的总线（URT-2 等半双工适配器），运行 `python tools/imu200/imu200.py check --port COMx --only-imu`（只问 200），再接舵机跑完整的 `check`。
6. 用逻辑分析仪检查1Mbps、DE极性、最后停止位后释放、RX恢复及最坏回复延迟。
7. 接入一个舵机，再接完整总线；ID200放第一。记录错误、丢包、FIFO及采样年龄。
8. 完成主控失效处理和安装方向核对后，再进行支撑状态下的整机联调。

### 电脑验收工具

总线验收用 [`tools/imu200/imu200.py`](../../../tools/imu200/imu200.py)（0.1.0 的 `Tools/imu_probe.py` 说的是 Dynamixel 协议，已随协议更换删除）。需要 Python 3.10+ 和 pyserial：

```powershell
python tools/imu200/imu200.py check --port COM5   # 13 项逐条 PASS/FAIL，判据照主控源码
python tools/imu200/imu200.py demo                # 不接硬件，看假小板怎么答
```

把 COM5 替换为**半双工总线适配器**端口；J3日志口不能响应这些协议指令。日志落在 `tools/imu200/logs/`（原始收发十六进制 + 每帧一行 JSONL）。
需要安装可运行的 Python，Windows 应用商店入口占位符不能运行这些脚本；编译固件本身无需 Python。

## 7. 验证与已知限制

测试代码使用实际 C 编译器运行；SPI/FIFO测试用模拟寄存器和时间，不等同于芯片实测。
安装 MSVC 后，在其 **x64 Native Tools Command Prompt / Developer PowerShell** 中运行 `Tools/test.ps1` 重复主机测试。
该入口要求 `cl` 已在 PATH 中；可传 `-PythonExe` 指定自己的 Python。单独运行两份 C 测试 `.cmd` 时，
也可将自己的 `vcvars64.bat` 完整路径作为第一个参数。测试脚本不会安装编译器，也不连接硬件。
当前验证记录见 `VALIDATION.md`，第三方源版本见 `DEPENDENCIES.md`。

待实板确认：电源与装配、HSI波特率误差、SPI模式/边沿/片选时序、TX使能时序、总线电气电平、
FIFO实际更新率、SFLP初始收敛和坐标方向、温漂、看门狗恢复及长时间共线运行。
软件测试通过不能替代这些验收。

## 8. 资料依据

- [本板硬件](https://github.com/UnitClaw/microduck-replica/tree/a1f4979c425bd9228622be89f2bfa4d1de7fbde3/hardware/imu_to_dxl)
- [STM32G031数据手册](https://www.st.com/resource/en/datasheet/stm32g031f8.pdf)
- [LSM6DSV16X数据手册](https://www.st.com/resource/en/datasheet/lsm6dsv16x.pdf)
- [ST IMU驱动](https://github.com/STMicroelectronics/lsm6dsv16x-pid)
- 飞特《SCS 通信协议》与内存表：仓库 [`docs/飞特资料/`](../../../docs/飞特资料/)
- [本板总线协议（接口契约）](../总线协议.md)
- [所检查的上游主控接口](https://github.com/pollen-robotics/microduck/blob/5984efb770855432b03dafd3d879e9929981e45b/duck-control/src/bus.rs)

本项目新写代码按 MIT 许可提供；第三方文件保留各自版权和许可，见各 Drivers 目录。
