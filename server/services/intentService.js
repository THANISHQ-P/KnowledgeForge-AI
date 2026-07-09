export function detectIntent(question) {

    const q = question.toLowerCase().trim();

     // Greetings
    if (
        ["hi","hello","hey","hii","good morning","good afternoon","good evening"]
        .includes(q)
    ) return "greeting";

    if (q.includes("how are you")) return "howareyou";

    if (q.includes("who are you")) return "about";

    if (q.includes("help")) return "help";

    if (q.includes("thank")) return "thanks";

    if (q.includes("bye") || q.includes("goodbye"))
        return "bye";

    // Lists
    if (q.includes("show all sop"))
        return "list_sop";

    if (q.includes("show all machine"))
        return "list_machine";

    if (q.includes("show all safety"))
        return "list_safety";

    if (q.includes("show all repair"))
        return "list_repair";

    if (q.includes("show all"))
        return "list";

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