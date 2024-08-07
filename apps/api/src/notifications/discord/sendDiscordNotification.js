export async function sendDiscordNotification(webhook, message) {
    try {
        console.log("Sending Discord notification to webhook URL:", webhook);
        const response = await fetch(webhook, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                content: message,
            }),
        });
        if (!response.ok) {
            console.error("Failed to send Discord notification");
        }
    }
    catch (error) {
        console.error("Error sending notification to Discord:", error);
    }
}
export async function sendSlackNotification(webhook, message) {
    try {
        console.log("Sending Slack notification to webhook URL:", webhook);
        const response = await fetch(webhook, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                text: message,
            }),
        });
        if (!response.ok) {
            console.error("Failed to send Slack notification");
        }
    }
    catch (error) {
        console.error("Error sending notification to Slack:", error);
    }
}
