# 前言

## 配套图书阅读入口

- **在线电子书（GitHub Pages 自动编译）**：<https://unitclaw.github.io/microduck-wwduck/>
- **书稿源码仓库**：<https://github.com/UnitClaw/microduck-wwduck>（`docs/book/` 目录，mdbook 编写，随提交自动编译部署为网页电子书）

> 本书每一章书稿都与配套工程仓库的 commit hash 一一绑定，读者可 checkout 到对应版本，完整复现书中每一步实验。
> 电子书每个章节**右上角**都有两个入口：📝「编辑」图标直达该章源文件、Octocat 图标直达仓库首页。

## 电子书章节 ↔ 仓库资源对照

每一章都对应仓库里的具体工程资源，点击即可跳转查阅源码、图纸、清单与日志：

| 电子书章节 | 仓库对应资源 |
|---|---|
| 第 2 章 配件商城 | [PARTS.md](https://github.com/UnitClaw/microduck-wwduck/blob/master/PARTS.md) · [官网商城](https://www.wwntai.com/parts.html) |
| 第 3 章 最小仿真 Demo | [software/training/](https://github.com/UnitClaw/microduck-wwduck/tree/master/software/training) |
| 第 4 章 CAD 模型解析 | [cad/](https://github.com/UnitClaw/microduck-wwduck/tree/master/cad) · [CAD 仓库](https://github.com/UnitClaw/microduck-replica-cad) |
| 第 5 章 Onshape → MJCF | [scripts/](https://github.com/UnitClaw/microduck-wwduck/tree/master/scripts) |
| 第 6 章 3D 打印与装配 | [print/](https://github.com/UnitClaw/microduck-wwduck/tree/master/print) · [BOM.md](https://github.com/UnitClaw/microduck-wwduck/blob/master/BOM.md) |
| 第 7 章 硬件电路与总线 | [hardware/](https://github.com/UnitClaw/microduck-wwduck/tree/master/hardware) |
| 第 8 章 RK3566 镜像与固件 | [software/image/](https://github.com/UnitClaw/microduck-wwduck/tree/master/software/image) · [software/studio/](https://github.com/UnitClaw/microduck-wwduck/tree/master/software/studio) |
| 第 9 章 舵机 / IMU 标定 | [tools/](https://github.com/UnitClaw/microduck-wwduck/tree/master/tools) |
| 第 10~14 章 仿真与训练 | [software/training/](https://github.com/UnitClaw/microduck-wwduck/tree/master/software/training) |
| 第 15 章 ONNX 部署 | [software/studio/](https://github.com/UnitClaw/microduck-wwduck/tree/master/software/studio) |
| 第 16 章 真机步态 | [software/](https://github.com/UnitClaw/microduck-wwduck/tree/master/software) |
| 第 18 章 工程化与开源 | [NOTICE.md](https://github.com/UnitClaw/microduck-wwduck/blob/master/NOTICE.md) · [LICENSE](https://github.com/UnitClaw/microduck-wwduck/blob/master/LICENSE) |
| 附录 B BOM 采购清单 | [BOM.md](https://github.com/UnitClaw/microduck-wwduck/blob/master/BOM.md) |
| 附录 C 故障排查 | [踩坑记录.md](https://github.com/UnitClaw/microduck-wwduck/blob/master/踩坑记录.md) |

> 仓库侧反向入口：仓库 `README.md` 顶部有电子书在线阅读链接与配件商城入口；`PARTS.md`、`BOM.md` 等文档也标注了对应电子书章节。

## 核心工程亮点（本书重点创新）

本书在社区 `microduck-replica` 复刻项目的基础上，补齐了六大工程闭环，构成相对 Pollen 原版与社区复刻的**重点创新**：

### 亮点 1｜Onshape → MJCF 自动化流水线（对标 Pollen 原厂）

完整复刻 Pollen 原厂 Onshape → MJCF 自动化工作流：从整机 STEP 装配导入，自动计算每个连杆的**质量、重心、惯性张量**，配合 `validate_mjcf.py` 自动校验惯性张量、关节限位与整机总质量，**彻底告别 replica 手动估算惯性参数**带来的 Sim2Real 偏差。

> 对应第 5 章 · 交付物：`scripts/cad2mjcf/export_mjcf.py` + `validate_mjcf.py`

### 亮点 2｜HD1910 舵机 BAM 台架实测辨识

对飞特 HD1910 做**台架实测辨识**，拟合 BAM（Bandwidth-Aware Motor）模型全套参数——带宽、粘性摩擦、库仑摩擦、转子惯量、齿隙，解决原版 replica 使用经验估算参数导致的 Sim2Real 迁移偏差。

> 对应第 9、11 章 · 交付物：`scripts/calibration/hd1910_bench_data_process.py`

### 亮点 3｜扩展域随机化 + 课程学习

在基础域随机化上扩展 8 维参数集（质量、摩擦、扭矩、带宽、齿隙、IMU 噪声、地面摩擦、重力），配合**课程学习**从站立逐步过渡到行走、转向、爬坡；并以**消融实验**对比不同随机策略的真机迁移成功率。

> 对应第 12、13 章 · 交付物：`domain_rand` 扩展参数集 + 课程调度逻辑

### 亮点 4｜仿真观测空间 ↔ 板端固件自动校验

提供**仿真观测空间 ↔ 板端 Rust 固件自动校验脚本**，一键比对观测/动作的维度、缩放与顺序，杜绝 Sim2Real 最常见的维度/缩放不一致隐性 bug。

> 对应第 8、15 章 · 交付物：`scripts/validation/check_obs_act_space.py`

### 亮点 5｜完整实验管理体系（可复现）

建立标准化的**实验管理体系**：每一次训练保存 `config.yaml`、MJCF 快照、BAM 参数、训练日志与 TensorBoard 曲线，任一实验可一键复现、可回溯。

> 对应第 18 章 · 交付物：`experiments/` 目录规范（config / mjcf / bam_params / logs / readme）

### 亮点 6｜Docker 锁定依赖版本

用 Docker 锁定 CUDA、Python、MuJoCo-Warp、mjlab 等依赖版本，消除「本地能跑、别人跑不起来」的环境问题，一键复现训练环境。

> 对应第 3、18 章 · 交付物：`Dockerfile` + `requirements-lock.txt`

---

## 为什么写这本书

2025 年，Pollen Robotics 联合 Hugging Face 发布 MicroDuck，一台基于 Sim2Real 强化学习的开源双足机器鸭。它的核心范式是：在 GPU 仿真环境中训练机器人策略，再直接部署到真实硬件，不需要传统步态规划。

原版 MicroDuck 使用 Dynamixel 舵机，海外预售，中国大陆无法直邮，整机 399 美元，加上转运、关税成本高昂，普通爱好者与国内高校实验室很难获取。社区诞生了 `microduck-replica` 复刻项目，将 MicroDuck 的机械结构移植，使用国产飞特 HD1910 总线舵机。

但原始复刻项目存在明显短板：
- MJCF 动力学模型依靠**手动估算连杆惯性、重心**，仿真与真机动力学差异大，Sim2Real 迁移困难；
- HD1910 舵机 BAM 模型参数为经验估算，没有台架实测标定流程；
- 缺少标准化实验管理，训练配置、模型、日志零散，难以复现；
- 没有一键容器化环境，CUDA、Warp、mjlab 版本依赖极易冲突；
- 缺少完整工程踩坑记录，读者遇到仿真倒地、真机抖动、舵机丢包等问题时无系统排查方案。

本书的目标，就是补齐这套工程闭环：**完整复刻 Pollen 原厂 Onshape→MJCF 自动化工作流，把 HD1910 舵机 BAM 实测辨识、域随机化、课程学习、RK3566 板端部署全部落地，形成一套国内可复现、低成本的国产舵机版 MicroDuck 全栈工程实践。**

本书不是纯理论的强化学习教科书，也不是简单的零件组装手册。它是**工程实践日志**：包含成功的实验、失败的尝试、参数消融对比、仿真与真机之间的 Gap 诊断。

## 本书定位与读者

- 机器人、具身智能、强化学习方向研究生/本科生；
- 高校机器人实验室工程师、开源硬件爱好者；
- 想入门 Sim2Real、MuJoCo-Warp、低成本双足强化学习机器人开发者。

> 阅读路径推荐：
> 1. 先跑【第3章 最小仿真Demo】，Docker 一键启动仿真，直观看到机器鸭仿真步态；
> 2. 理解 Sim2Real 整体链路之后，再阅读机械 CAD、3D 打印、硬件装配章节；
> 3. 进阶读者深入 BAM 模型、系统辨识、域随机化消融实验。

## 全书技术链路

`STEP装配 → Onshape云端CAD（设置零件密度、舵机质量覆盖） → onshape-to-robot导出MJCF → MuJoCo-Warp GPU仿真 → BAM舵机模型（台架实测辨识HD1910参数） → 域随机化+课程学习PPO多任务训练 → ONNX策略导出 → RK3566 Rust固件50Hz实时推理 → 真机采集IMU/关节数据 → 系统辨识修正动力学模型 → 迭代重训`

## 开源许可边界（务必阅读）

1. 本书书稿正文：CC-BY 4.0，自由阅读、分享，引用时保留署名；
2. 上游软件代码：Apache 2.0；
3. 机械 CAD 模型：CC BY-NC-SA，**仅限非商用学习、科研**。

> 若读者需要商用产品，必须独立正向设计机械结构，脱离本套 CAD 模型。

本书配套工程仓库：所有代码、脚本、实验记录、Docker 配置、书稿源码全部托管在 GitHub，每一个书稿章节绑定仓库 commit hash，你可以 checkout 到对应版本，保证代码与书中内容完全一致。

## 致谢

感谢 Pollen Robotics 开源 MicroDuck、mjlab 与 microduck_rl；感谢 fanhao375 开源 microduck-replica 与 microduck-replica-cad；感谢飞特提供 HD1910 舵机硬件与技术文档；感谢所有开源社区开发者。

> 完整的公司介绍与致谢（Pollen、飞特、fanhao375、机械行者Robo、kissqy、LuwuDynamics、Rhoban 等）见书末 **【致谢】** 章节。

> 本书持续迭代，工程实验会持续更新；勘误、改进建议欢迎提交 GitHub Issue。
