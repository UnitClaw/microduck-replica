# 附录A 代码清单

> 本书配套的全部代码、脚本与配置，按仓库路径索引。所有代码以仓库 `book-dev` 分支为准。

## A.1 仿真与训练代码（software/training/）

| 文件 | 用途 | 对应章节 |
|---|---|---|
| `mjlab/actuators/bam_actuator.py` | BAM 舵机模型（HD1910 参数） | 第10章 |
| `assets/robots/microduck_feetech.xml` | 飞特版 MJCF 模型 | 第4、9章 |
| `train_ppo.py` | PPO 训练主脚本（含域随机化） | 第11、12章 |
| `export_onnx.py` | 导出 ONNX 策略 | 第12章 |
| `test_env.py` | 仿真环境自检 | 第9章 |
| `requirements.txt` / `requirements-lock.txt` | 依赖清单 | 第9章 |

## A.2 标定与系统辨识（scripts/calibration/）

| 文件 | 用途 | 对应章节 |
|---|---|---|
| `hd1910_bench_data_process.py` | 台架CSV→BAM参数拟合 | 第8、10章 |
| `system_id_fit.py` | 真机数据→惯性参数辨识 | 第15章 |

## A.3 CAD 导出（scripts/cad2mjcf/）

| 文件 | 用途 | 对应章节 |
|---|---|---|
| `onshape_config.json` | Onshape 装配配置 | 第4章 |
| `export_mjcf.py` | onshape-to-robot 一键导出 | 第4章 |
| `validate_mjcf.py` | MJCF 惯性/限位校验 | 第4章 |

## A.4 校验脚本（scripts/validation/）

| 文件 | 用途 | 对应章节 |
|---|---|---|
| `check_bam_params.py` | BAM 参数物理合理性校验 | 第10章 |
| `check_obs_act_space.py` | 仿真↔板端观测空间比对 | 第7、14章 |
| `mass_inertia_check.py` | 整机质量/惯性校验 | 第5章 |

## A.5 容器与配置（docker/）

| 文件 | 用途 | 对应章节 |
|---|---|---|
| `Dockerfile` | GPU 训练环境镜像 | 第9章 |
| `docker-compose.yml` | 一键启动 | 第9章 |

## A.6 实验配置示例（experiments/）

| 目录 | 用途 | 对应章节 |
|---|---|---|
| `exp01_standup/config.yaml` | 站立训练配置 | 第2章 |
| `exp02_walk_flat/config.yaml` | 平地行走配置 | 第12章 |
| `exp03_domain_rand/config.yaml` | 域随机化消融 | 第11章 |
| `exp04_curriculum/config.yaml` | 课程学习配置 | 第11章 |

## A.7 板端固件（software/firmware/）

Rust 多守护进程：`robotd`（主控制环）、`configd`（配置）、`busd`（总线）、`webui`（调试界面）。对应第 7 章。
