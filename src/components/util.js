export function compLevelToHumanReadable(compLevel) {
    switch(compLevel) {
        case "qm":
            return "Qualifiers";
        case "ef":
            return "Eighths Finals";
        case "qf":
            return "Quarterfinals";
        case "sf":
            return "Semifinals";
        case "f":
            return "Finals";
        default:
            return "Not Specified";
    }
}