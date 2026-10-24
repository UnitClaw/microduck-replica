# Appendix A — Code Inventory

> All code, scripts, and configuration accompanying this book, indexed by repository path. All code follows the repository's `book-dev` branch.

## A.1 Simulation and Training Code (software/training/)

| File | Purpose | Chapter |
|---|---|---|
| `mjlab/actuators/bam_actuator.py` | BAM servo model (HD1910 parameters) | Ch. 11 |
| `assets/robots/microduck_feetech.xml` | Feetech-edition MJCF model | Ch. 5, 10 |
| `train_ppo.py` | PPO training main script (with domain randomization) | Ch. 12, 13 |
| `export_onnx.py` | export the ONNX policy | Ch. 13 |
| `test_env.py` | simulation-environment self-check | Ch. 10 |
| `requirements.txt` / `requirements-lock.txt` | dependency list | Ch. 10 |

## A.2 Calibration and System Identification (scripts/calibration/)

| File | Purpose | Chapter |
|---|---|---|
| `hd1910_bench_data_process.py` | bench CSV → BAM parameter fitting | Ch. 9, 11 |
| `system_id_fit.py` | hardware data → inertia-parameter identification | Ch. 16 |

## A.3 CAD Export (scripts/cad2mjcf/)

| File | Purpose | Chapter |
|---|---|---|
| `onshape_config.json` | Onshape assembly configuration | Ch. 5 |
| `export_mjcf.py` | one-command onshape-to-robot export | Ch. 5 |
| `validate_mjcf.py` | MJCF inertia/limit validation | Ch. 5 |

## A.4 Validation Scripts (scripts/validation/)

| File | Purpose | Chapter |
|---|---|---|
| `check_bam_params.py` | BAM parameter physical-sanity check | Ch. 11 |
| `check_obs_act_space.py` | simulation ↔ board observation-space comparison | Ch. 8, 15 |
| `mass_inertia_check.py` | whole-machine mass/inertia validation | Ch. 6 |

## A.5 Container and Configuration (docker/)

| File | Purpose | Chapter |
|---|---|---|
| `Dockerfile` | GPU training environment image | Ch. 10 |
| `docker-compose.yml` | one-command startup | Ch. 10 |

## A.6 Example Experiment Configurations (experiments/)

| Directory | Purpose | Chapter |
|---|---|---|
| `exp01_standup/config.yaml` | standing training config | Ch. 3 |
| `exp02_walk_flat/config.yaml` | flat-ground walking config | Ch. 13 |
| `exp03_domain_rand/config.yaml` | domain-randomization ablation | Ch. 12 |
| `exp04_curriculum/config.yaml` | curriculum-learning config | Ch. 12 |

## A.7 On-Device Firmware (software/firmware/)

Rust multi-daemon system: `robotd` (main control loop), `configd` (configuration), `busd` (bus), `webui` (debug interface). See Chapter 8.
