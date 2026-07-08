import { supabase } from "./supabase";

const definitions = {
  cnc: "CNC (Computer Numerical Control) is an automated manufacturing process that controls machines using computers.",

  boiler:
    "Industrial boilers produce steam or hot water for manufacturing processes. Regular inspection and safety checks are essential.",

  sop:
    "SOP (Standard Operating Procedure) is a written document describing how a task should be performed safely and correctly.",

  safety:
    "Industrial safety includes practices that protect workers, equipment and the environment from accidents.",

  maintenance:
    "Maintenance is the inspection, servicing and repair of machines to prevent failures and downtime.",

  machine:
    "Industrial machines are used to manufacture products through cutting, drilling, milling, welding and assembly operations.",

  quality:
    "Quality control ensures products satisfy industrial standards before delivery.",

  warehouse:
    "Warehouse management involves storing, tracking and handling industrial materials efficiently.",

  production:
    "Production is the process of converting raw materials into finished products."
};

export async function askAI(question) {

  const keyword = question.toLowerCase().trim();

  let definition = "";

  for (const key in definitions) {
    if (keyword.includes(key)) {
      definition = definitions[key];
      break;
    }
  }

  const { data, error } = await supabase
    .from("knowledge_library")
    .select("*");

  if (error) {
    return `
      <h3>❌ Error</h3>
      Unable to search the knowledge library.
    `;
  }

  const words = keyword.split(" ");

  const results = data.filter((item) => {

    const text = `
      ${item.title}
      ${item.category}
      ${item.description}
    `.toLowerCase();

    return words.some((word) => text.includes(word));

  });

  let reply = "";

  reply += `
    <h2>🤖 KnowForge AI</h2>
  `;

  if (definition !== "") {

    reply += `
      <h3>Definition</h3>

      <p>${definition}</p>

      <hr>
    `;

  }

  if (results.length === 0) {

    reply += `
      <h3>No Related Knowledge Found</h3>

      <p>
      No document in the knowledge library matches your query.
      </p>

      <p><b>Confidence :</b> Medium</p>
    `;

    return reply;

  }

  reply += `
    <h3>📚 Related Knowledge</h3>

    <p>
    Found <b>${results.length}</b> related document(s).
    </p>
  `;

  results.forEach((doc, index) => {

    reply += `
      <div style="
        background:#1E293B;
        border:1px solid #334155;
        border-radius:12px;
        padding:15px;
        margin-bottom:18px;
      ">

        <h3>${index + 1}. ${doc.title}</h3>

        <p>
        <b>Category:</b> ${doc.category}
        </p>

        <p>
        <b>Description:</b><br>
        ${doc.description}
        </p>

        <a
          href="${doc.file_url}"
          target="_blank"
          style="
            display:inline-block;
            background:#2563EB;
            color:white;
            padding:10px 18px;
            border-radius:8px;
            text-decoration:none;
            margin-top:10px;
          "
        >
          📂 Open Document
        </a>

      </div>
    `;

  });

  reply += `
    <hr>

    <p>
    <b>AI Confidence :</b> High ✅
    </p>
  `;

  return reply;

}