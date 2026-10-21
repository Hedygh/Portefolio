console.log("AUDIO_MANAGER_NEW_VERSION");
export class AudioManager {
  constructor() {
    this.sounds = {

      playerDestroy: new Audio(
        "../assets/audio/player_destroy.wav"
      ),

      enemyDestroy: new Audio(
        "../assets/audio/enemy_destroy.mp3"
      ),

			bonusPickup: new Audio(
  			"../assets/audio/bonus_pickup.mp3"
			),

      backgroundMusic: new Audio(
        "../assets/audio/intro.mp3"
      ),

      boss1Music: new Audio(
        "../assets/audio/boss1_music.mp3"
      ),

      boss2Music: new Audio(
        "../assets/audio/boss2_music.mp3"
      ),

      boss3Music: new Audio(
        "../assets/audio/boss3_music.mp3"
      ),

      bossEyeShoot: new Audio(
        "../assets/audio/boss_eye_shoot.mp3"
      ),

      bossDestroy: new Audio(
        "../assets/audio/boss_death.mp3"
      ),

      wormTurn: new Audio(
        "../assets/audio/worm_turn2.mp3"
      ),

      fireBall: new Audio(
        "../assets/audio/fireball.mp3"
      ),

      laserCharge: new Audio(
        "../assets/audio/laser_charge.mp3"
      ),

      laserLoop: new Audio(
        "../assets/audio/laser_loop.mp3"
      ),

      phase3_1: new Audio(
        "../assets/audio/phase3_1.mp3"
      ),

      phase3_2: new Audio(
        "../assets/audio/phase3_2.mp3"
      ),

      dragonLaser: new Audio(
          "../assets/audio/laser_beam.mp3"
      ),

      steeleyeSwoosh: new Audio(
          "../assets/audio/swoosh.mp3"
      ),

      sideEnemyTriple: new Audio(
        "../assets/audio/sidelaser.mp3"
      ),

      bossHit: new Audio
        ("../assets/audio/boss_hit.mp3")
    };

    this.shootPool = [];

    for (let i = 0; i < 5; i++) {
    const laser = new Audio(
        "../assets/audio/shoot_sound03-3.mp3"
    );

    laser.volume = 0.06;



    this.shootPool.push(laser);
    }
    this.currentShoot = 0;

    this.sounds.backgroundMusic.loop = true;
    this.sounds.boss1Music.loop = true;
    this.sounds.boss2Music.loop = true;
    this.sounds.boss3Music.loop = true;
    this.sounds.backgroundMusic.volume = 0.15;
    this.sounds.boss1Music.volume = 0.35;
    this.sounds.boss2Music.volume = 0.29;
    this.sounds.boss3Music.volume = 0.35;
		this.sounds.bonusPickup.volume = 0.40;
    this.sounds.enemyDestroy.volume = 0.5;
    this.sounds.playerDestroy.volume = 0.11;
    this.sounds.bossEyeShoot.volume = 0.35;
    this.sounds.bossDestroy.volume = 0.65;
    this.sounds.wormTurn.volume = 0.35;
    this.sounds.fireBall.volume = 0.22;

    this.sounds.laserLoop.loop = true;

    this.sounds.laserCharge.volume = 0.40;
    this.sounds.laserLoop.volume = 0.18;
    this.sounds.phase3_1.volume = 0.50;
    this.sounds.phase3_2.volume = 0.40;
    this.sounds.dragonLaser.volume = 0.35;

    // 5 lecteurs du meme son
    this.steeleyeSwooshPool = Array.from(
      { length: 5 },
      () => {
        const audio = this.sounds.steeleyeSwoosh.cloneNode();
        audio.volume = 0.15;
        return audio;
      }
    );

    this.steeleyeSwooshIndex = 0;

    this.sounds.sideEnemyTriple.volume = 0.03;
    this.sideEnemyTriplePool = Array.from(
      { length: 5 },
      () => {
        const audio = this.sounds.sideEnemyTriple.cloneNode();
        audio.volume = 0.03;
        return audio;
      }
    );
    this.bossHitContext = new AudioContext();
    this.bossHitBuffer = null;
    this.lastBossHitSound = 0;

    fetch("../assets/audio/boss_hit.mp3")
      .then(response => {
        if (!response.ok) {
          throw new Error("Boss hit audio not found");
        }
        return response.arrayBuffer();
      })
      .then(buffer => this.bossHitContext.decodeAudioData(buffer))
      .then(decoded => {
        this.bossHitBuffer = decoded;
      })
      .catch(error => console.error("Boss hit audio:", error));
  }

  playSound(name) {
    const sound = this.sounds[name];

    if (!sound) {
      return;
    }

    sound.currentTime = 0;

    sound.play().catch((error) => {
      console.error(
        `Impossible de jouer ${name}:`,
        error
      );
    });
  }
	playShoot() {
		for (const laser of this.shootPool) {
			if (
				laser.paused ||
				laser.ended ||
				laser.currentTime > 0.35
			) {
				laser.currentTime = 0;

				laser.play().catch((error) => {
					console.error(
						"Impossible de jouer le tir :",
						error
					);
				});

				return;
			}
		}
	}
  playMusic(name) {
    const music = this.sounds[name];

    if (!music || !music.paused) {
      return;
    }

    music.play().catch((error) => {
      console.error(
        `Impossible de jouer ${name}:`,
        error
      );
    });
  }

	pauseMusic(name) {
		const music = this.sounds[name];

		if (!music) {
			return;
		}

		music.pause();
	}

  stopMusic(name) {
    const music = this.sounds[name];

    if (!music) {
      return;
    }

    music.pause();
    music.currentTime = 0;
  }

  playDragonPhaseThree() {
    this.playSound("phase3_1");

    setTimeout(() => {
      this.playSound("phase3_2");
    }, 180);
  }

  playSteelEyeSwoosh() {
    const sound = this.steeleyeSwooshPool[this.steeleyeSwooshIndex];


    console.log("SteelEye volume:", sound.volume);

    sound.currentTime = 0;
    sound.play().catch(() => {});

    this.steeleyeSwooshIndex =
      (this.steeleyeSwooshIndex + 1) % this.steeleyeSwooshPool.length;
  }

  playSideEnemyTriple() {
    const sound = this.sideEnemyTriplePool.find(
      (sound) => sound.paused || sound.ended
    );

    if (!sound) return;

    sound.currentTime = 0;
    sound.play().catch(() => {});
  }

  playBossHit() {
    if (!this.bossHitBuffer) return;

    const now = performance.now();

    if (now - this.lastBossHitSound < 70) return;

    this.lastBossHitSound = now;

    const source = this.bossHitContext.createBufferSource();
    const gain = this.bossHitContext.createGain();

    source.buffer = this.bossHitBuffer;
    gain.gain.value = 0.12;

    source.connect(gain);
    gain.connect(this.bossHitContext.destination);

    if (this.bossHitContext.state === "suspended") {
      this.bossHitContext.resume().catch(() => {});
    }

    source.start();
  }
}