function Message({ sender, text, source, ai }) {

    return (

        <div className={`message ${sender}`}>

            {ai && (

                <div className="ai-badge">

                    <span className="green-dot"></span>

                    AI Generated

                </div>

            )}

            <div>{text}</div>

            {source && (

                <div className="source">
                    {source.expert ? (
                        <>
                            📄 {source.expert} — Source: {source.title}
                        </>
                    ) : (
                        <>📄 Source: {source.title}</>
                    )}
                </div>

            )}

        </div>

    );

}

export default Message;