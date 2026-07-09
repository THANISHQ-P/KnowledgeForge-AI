export function extractRepair(text){

const match=text.match(

/Repair Steps([\s\S]*?)Safety Checklist/i

);

return match?match[1].trim():"Repair steps not found.";

}



export function extractSafety(text){

const match=text.match(

/Safety Checklist([\s\S]*?)Required Tools/i

);

return match?match[1].trim():"Safety checklist not found.";

}



export function extractTools(text){

const match=text.match(

/Required Tools([\s\S]*?)Estimated Repair Time/i

);

return match?match[1].trim():"Required tools not found.";

}



export function extractTime(text){

const match=text.match(

/Estimated Repair Time([\s\S]*?)Preventive Maintenance/i

);

return match?match[1].trim():"Estimated time not found.";

}



export function extractSOP(text){

const match=text.match(

/Related SOP([\s\S]*?)Training Video/i

);

return match?match[1].trim():"SOP not found.";

}