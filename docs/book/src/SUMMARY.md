# Summary

[前言](README.md)

## 第一篇：绪论与快速上手
- [第1章 机器鸭的由来：Pollen MicroDuck 与开源具身智能](ch01_intro.md)
- [第2章 配件商城与备料指南（散件与配件）](ch02_parts_store.md)
- [第3章 最小仿真Demo：一键启动飞特版MicroDuck仿真](ch03_minimal_demo.md)

## 第二篇：机械CAD与Onshape自动导出MJCF
- [第4章 飞特HD1910版本CAD模型解析](ch04_cad_overview.md)
- [第5章 Onshape + onshape-to-robot 自动化MJCF工作流](ch05_cad2mjcf.md)
- [第6章 3D打印、装配、BOM与公差](ch06_3dprint_assembly.md)

## 第三篇：硬件电路、总线与RK3566板端系统
- [第7章 硬件电路与HD1910 TTL总线系统](ch07_hardware_bus.md)
- [第8章 RK3566镜像部署与Rust固件](ch08_rk3566_firmware.md)
- [第9章 舵机、IMU真机标定与台架测试](ch09_calibration.md)

## 第四篇：仿真、BAM执行器与强化学习
- [第10章 MuJoCo-Warp + mjlab仿真环境基础](ch10_mujoco_warp.md)
- [第11章 BAM舵机执行器模型与HD1910参数辨识](ch11_bam_actuator.md)
- [第12章 域随机化 Domain Randomization](ch12_domain_randomization.md)
- [第13章 PPO多任务策略训练](ch13_ppo_multi_task.md)
- [第14章 仿真调试与故障排查](ch14_sim_debug.md)

## 第五篇：Sim2Real真机部署与步态迭代
- [第15章 ONNX策略部署到RK3566](ch15_onnx_deploy.md)
- [第16章 真机步态调优，仿真与现实闭环迭代](ch16_real_robot_tune.md)
- [第17章 拓展任务：转向、爬坡、避障](ch17_extend_task.md)

## 第六篇：工程化、开源合规与进阶拓展
- [第18章 仓库工程化与开源许可](ch18_oss_license.md)
- [第19章 进阶拓展方向](ch19_future.md)

## 附录
- [附录A：代码清单](appendix_a_code.md)
- [附录B：BOM采购清单](appendix_b_bom.md)
- [附录C：故障排查手册](appendix_c_troubleshoot.md)
- [附录D：术语表](appendix_d_glossary.md)
- [附录E：参考文献BibTeX](appendix_e_references.md)
