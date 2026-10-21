# Download print files from the CAD repository

[简体中文](README.md) · **English**

**Models, mechanical parts and printing projects are maintained in [UnitClaw/microduck-replica-cad](https://github.com/UnitClaw/microduck-replica-cad). Select the version matching your servos there.**

| Servo | Download |
|---|---|
| Feetech HD-1910 | [CAD repository](https://github.com/UnitClaw/microduck-replica-cad); current checked release: [v2.1](https://github.com/fanhao375/microduck-replica-cad/releases/tag/v2.1), as of 2026-09-28 |
| Dynamixel XL330 | [CAD repository](https://github.com/UnitClaw/microduck-replica-cad); current checked release: [v1.1](https://github.com/fanhao375/microduck-replica-cad/releases/tag/v1.1), as of 2026-09-28 |
| Materials, quantities and assembly | [CAD documentation and BOM](https://github.com/UnitClaw/microduck-replica-cad#装配-bom) |

**Do not mix mating parts from the Feetech and XL330 versions.** The old STLs here came from the upstream XL330 simulation model and did not include the Feetech CAD changes. They were removed on 2026-09-28 to prevent incorrect prints; Git history retains them for reference. This repository no longer maintains a second download copy of those models.

At the time of this check, the CAD repository's **09-15 3MF does not include the v2.1 combined TPU wheel**. Check each file's version before printing; that change affects the roller variant. SolidWorks and STEP downloads are CAD sources, not sliced printer files.

Meshes retained in `software/training/` and the web servo console are for simulation/display, **not manufacturing**. Their geometry, mass and inertia have not been updated to match the latest physical CAD in this change.

CAD modelling and documentation are by **机械行者Robo**, under **CC BY-NC-SA 4.0** as derivatives of the upstream models. See the CAD repository for attribution, licensing and later versions.
