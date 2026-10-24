# Appendix A — Code Inventory

> All code, scripts, and configuration accompanying this book, indexed by repository path. All code follows the repository's `book-dev` branch.

## A.1 Simulation and Training Code (software/training/)

| File | Purpose | Chapter |
|---|---|---|
| `mjlab/actuators/bam_actuator.py` | BAM servo model (HD1910 parameters) | Ch. 10 |
| `assets/robots/microduck_feetech.xml` | Feetech-edition MJCF model | Ch. 4, 9 |
| `train_ppo.py` | PPO training main script (with domain randomization) | Ch. 11, 12 |
| `export_onnx.py` | export the ONNX policy | Ch. 12 |
| `test_env.py` | simulation-environment self-check | Ch. 9 |
| `requirements.txt` / `requirements-lock.txt` | dependency list | Ch. 9 |

## A.2 Calibration and System Identification (scripts/calibration/)

| File | Purpose | Chapter |
|---|---|---|
| `hd1910_bench_data_process.py` | bench CSV → BAM parameter fitting | Ch. 8, 10 |
| `system_id_fit.py` | hardware data → inertia-parameter identification | Ch. 15 |

## A.3 CAD Export (scripts/cad2mjcf/)

| File | Purpose | Chapter |
|---|---|---|
| `onshape_config.json` | Onshape assembly configuration | Ch. 4 |
| `export_mjcf.py` | one-command onshape-to-robot export | Ch. 4 |
| `validate_mjcf.py` | MJCF inertia/limit validation | Ch. 4 |

## A.4 Validation Scripts (scripts/validation/)

| File | Purpose | Chapter |
|---|---|---|
| `check_bam_params.py` | BAM parameter physical-sanity check | Ch. 10 |
| `check_obs_act_space.py` | simulation ↔ board observation-space comparison | Ch. 7, 14 |
| `mass_inertia_check.py` | whole-machine mass/inertia validation | Ch. 5 |

## A.5 Container and Configuration (docker/)

| File | Purpose | Chapter |
|---|---|---|
| `Dockerfile` | GPU training environment image | Ch. 9 |
| `docker-compose.yml` | one-command startup | Ch. 9 |

## A.6 Example Experiment Configurations (experiments/)

| Directory | Purpose | Chapter |
|---|---|---|
| `exp01_standup/config.yaml` | standing training config | Ch. 2 |
| `exp02_walk_flat/config.yaml` | flat-ground walking config | Ch. 12 |
| `exp03_domain_rand/config.yaml` | domain-randomization ablation | Ch. 11 |
| `exp04_curriculum/config.yaml` | curriculum-learning config | Ch. 11 |

## A.7 On-Device Firmware (software/firmware/)

Rust multi-daemon system: `robotd` (main control loop), `configd` (configuration), `busd` (bus), `webui` (debug interface). See Chapter 7.
