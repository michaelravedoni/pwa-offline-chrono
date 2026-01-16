<script setup>
defineProps({
  isOpen: Boolean
})

const emit = defineEmits(['close'])

const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream
</script>

<template>
  <div class="help-overlay" v-if="isOpen" @click.self="emit('close')">
    <div class="help-content">
      <div class="header">
        <h2>Aide & Installation</h2>
        <button class="close-btn" @click="emit('close')">×</button>
      </div>

      <div class="scroll-content">
        <section>
          <h3>⏱ Utilisation</h3>
          <ul>
            <li><strong>Start/Stop</strong> : Appuyez sur la grande zone verte/rouge.</li>
            <li><strong>Lap</strong> : Appuyez sur le bouton gris gauche pour marquer un tour.</li>
            <li><strong>Reset</strong> : Appuyez sur RESET quand le chrono est arrêté pour remettre à zéro.</li>
            <li><strong>Navigation</strong> : Utilisez la barre du bas pour changer de chronomètre (4 disponibles).</li>
            <li><strong>Sauvegarde</strong> : Un bouton "Enregistrer" apparaît quand vous arrêtez un chrono non vide.</li>
          </ul>
        </section>

        <section>
          <h3>📲 Installation (Mode Offline)</h3>
          <p>Pour une expérience parfaite (Plein écran, pas de barre d'adresse, fonctionne sans internet) :</p>
          
          <div v-if="isIOS" class="install-guide">
            <strong>Sur iPhone / iPad :</strong>
            <ol>
              <li>Appuyez sur le bouton <strong>Partager</strong> <span class="icon">⎋</span> (carré avec flèche vers le haut).</li>
              <li>Faites défiler vers le bas et sélectionnez <strong>"Sur l'écran d'accueil"</strong>.</li>
              <li>Confirmez en cliquant sur <strong>Ajouter</strong>.</li>
            </ol>
          </div>
          
          <div v-else class="install-guide">
            <strong>Sur Android / Chrome :</strong>
            <ol>
              <li>Ouvrez le menu du navigateur (3 points).</li>
              <li>Sélectionnez <strong>"Installer l'application"</strong> ou <strong>"Ajouter à l'écran d'accueil"</strong>.</li>
            </ol>
          </div>
        </section>

        <section>
          <h3>🔄 Fonctionnement Arrière-plan</h3>
          <p>Ce chronomètre continue de fonctionner avec précision même si vous changez d'onglet ou verrouillez votre téléphone.</p>
        </section>
      </div>
    </div>
  </div>
</template>

<style scoped>
.help-overlay {
  position: fixed;
  top: 0; 
  left: 0; 
  right: 0; 
  bottom: 0;
  background: rgba(0,0,0,0.85);
  z-index: 200;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  backdrop-filter: blur(5px);
}

.help-content {
  background: #222;
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid #444;
}

.header {
  padding: 1rem;
  border-bottom: 1px solid #333;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header h2 {
  margin: 0;
  font-size: 1.2rem;
}

.close-btn {
  background: none;
  border: none;
  font-size: 2rem;
  line-height: 1;
  color: #888;
  cursor: pointer;
  padding: 0 0.5rem;
}

.scroll-content {
  padding: 1rem;
  overflow-y: auto;
  font-size: 0.95rem;
  line-height: 1.5;
  color: #ddd;
}

h3 {
  color: #3498db;
  margin-top: 1.5rem;
  margin-bottom: 0.5rem;
}

ul, ol {
  padding-left: 1.5rem;
  margin: 0.5rem 0;
}

li {
  margin-bottom: 0.5rem;
}

.install-guide {
  background: #333;
  padding: 1rem;
  border-radius: 8px;
  margin-top: 0.5rem;
}

.icon {
  font-family: sans-serif;
  font-size: 1.2rem;
}
</style>
