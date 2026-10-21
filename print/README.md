# 打印文件统一到 CAD 仓库下载

**简体中文** · [English](README.en.md)

**模型、结构件和打印工程统一维护在 [UnitClaw/microduck-replica-cad](https://github.com/UnitClaw/microduck-replica-cad)。请从那里选择与你的舵机对应的版本。**

| 使用的舵机 | 下载入口 |
|---|---|
| 飞特 HD-1910 | [CAD 仓库 · 飞特版](https://github.com/UnitClaw/microduck-replica-cad#两个版本选一个下)；截至 2026-09-28 为 [v2.1](https://github.com/fanhao375/microduck-replica-cad/releases/tag/v2.1) |
| Dynamixel XL330 | [CAD 仓库 · XL330 版](https://github.com/UnitClaw/microduck-replica-cad#两个版本选一个下)；截至 2026-09-28 为 [v1.1](https://github.com/fanhao375/microduck-replica-cad/releases/tag/v1.1) |
| 材料、数量、装配步骤 | [CAD 仓库说明与装配 BOM](https://github.com/UnitClaw/microduck-replica-cad#装配-bom) |

**不要混用飞特和 XL330 的配合件。** 两种舵盘结构不同；本仓之前的 STL 来自上游 XL330 仿真模型，没有同步飞特改件。

2026-09-28 已从本目录移除旧 STL，避免下载后直接误打。旧文件仍可在 Git 历史中追溯，但不再作为当前打印包提供；主仓不再维护第二份模型下载副本。

截至本次核对，CAD 仓库的 **09-15 旧 3MF 尚未包含 v2.1 的 TPU 合体轮胎**。打印前以 CAD 仓库对应文件的版本说明为准，不要将旧 3MF 当成完整 v2.1；此差异只涉及轮滑变体。SolidWorks / STEP 包是 CAD 源文件，不是已经切片的打印文件。

主仓 `software/training/` 和网页调试台中保留的网格用于仿真及显示，**不是打印来源**。本次调整没有把这些模型、质量或惯量同步为最新实物 CAD。

图纸由 **机械行者Robo** 建模整理，依据上游模型采用 **CC BY-NC-SA 4.0**；作者、许可及后续版本以 [CAD 仓库](https://github.com/UnitClaw/microduck-replica-cad) 为准。
