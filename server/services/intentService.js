export function detectIntent(question) {

    const q = question.toLowerCase();

    if (
        q.includes("sop") ||
        q.includes("procedure") ||
        q.includes("operating procedure")
    ) {
        return "sop";
    }

    if (
        q.includes("repair") ||
        q.includes("fix") ||
        q.includes("troubleshoot") ||
        q.includes("problem")
    ) {
        return "repair";
    }

    if (
        q.includes("safety") ||
        q.includes("ppe") ||
        q.includes("precaution")
    ) {
        return "safety";
    }

    if (
        q.includes("tool") ||
        q.includes("equipment")
    ) {
        return "tools";
    }

    if (
        q.includes("time") ||
        q.includes("duration")
    ) {
        return "time";
    }

    if (
        q.includes("summary") ||
        q.includes("summarize") ||
        q.includes("explain") ||
        q.includes("what is") ||
        q.includes("overview")
    ) {
        return "ai";
    }

    return "chat";
}