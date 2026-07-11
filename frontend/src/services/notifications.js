/**
 * Service de gestion des notifications par navigateur pour AutoBrillance
 */

export const requestNotificationPermission = async () => {
  if (!("Notification" in window)) {
    console.log("Ce navigateur ne supporte pas les notifications de bureau");
    return false;
  }

  if (Notification.permission === "granted") return true;

  if (Notification.permission !== "denied") {
    const permission = await Notification.requestPermission();
    return permission === "granted";
  }

  return false;
};

export const sendNotification = (title, options = {}) => {
  if (Notification.permission === "granted") {
    const notification = new Notification(title, {
      icon: '/logo.png',
      badge: '/logo.png',
      ...options
    });

    notification.onclick = () => {
      window.focus();
      notification.close();
    };
  }
};

export const notifyStatusChange = (vehicle, newStatus) => {
  let title = "AutoBrillance";
  let body = "";

  if (newStatus === 'in_progress') {
    body = `Votre véhicule (${vehicle}) est maintenant en cours de lavage ! 🫧`;
  } else if (newStatus === 'done') {
    title = "✨ Véhicule Prêt !";
    body = `Le lavage de votre ${vehicle} est terminé. Vous pouvez venir le récupérer !`;
  }

  if (body) {
    sendNotification(title, { body });
  }
};
