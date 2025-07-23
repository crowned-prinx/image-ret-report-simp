import { useEffect, useState } from "react";

const ResultContent = ({content}) => {
    const [data, setData] = useState([]);

    useEffect(()=>{
        setData(content);
    },[content]);

    const roundUp = (number, places) => {
        return Number(number.toFixed(parseInt(places)));
    }


    return ( 
    <div className="flex flex-col items-center w-full overflow-x-scroll px-2">
        {data?.results?.length ?
        data?.results?.map((info) => (
            info?.rank === 0 ? 
            
            <div className="py-5" key={info?.rank}>
                <div className="w-full grid grid-cols-2 gap-4 text-white opacity-60">
                    <div className="flex-1/2">
                    <img
                        src={`data:image/png;base64,${info?.image_base64}`}
                        className="rounded-sm object-cover bg-black w-full"
                        alt={`Search Result Image ${info?.rank}`}
                        />
                    </div>
                    <div className="">
                        <div className="w-full p-1">
                            <h3 className="font-extrabold text-lg border-b-neutral-400 border-b">Your Query Image Info</h3>
                        </div>
                        <div className="grid grid-cols-1 flex-wrap ">
                           <div className="w-full flex flex-col py-6 space-y-6">
                                <div className="flex flex-col space-y-2">
                                    <div className="flex space-x-2">
                                        <p className="font-bold">Label: </p>
                                        <span>{info?.label}</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <p className="font-bold">Original report: </p>
                                        <span>{info?.original_text}</span>
                                     </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                 <div className="bg-amber-600/60 h-1 rounded-full my-6"></div>
            </div>
            : 
            <div className="py-5" key={info?.rank}>
                <div className="w-full grid grid-cols-2 gap-4 text-white opacity-60">
                    <div className="flex-1/2">
                    <img
                        src={`data:image/png;base64,${info?.image_base64}`}
                        className="rounded-sm object-cover bg-black w-full"
                        alt={`Search Result Image ${info?.rank}`}
                        />
                    </div>
                    <div className="">
                        <div className="w-full p-1">
                            <h3 className="font-extrabold text-lg border-b-neutral-400 border-b">Search Metrics for Sample {info?.rank}</h3>
                        </div>
                        <div className="grid grid-cols-2 flex-wrap ">
                            <div className="flex flex-col p-1 space-y-2.5">
                                <p className="w-full font-bold">Original report</p>
                                <p className="flex flex-col text-sm">
                                    <span className="pr-1 font-bold">Flesch kincaid grade:</span>
                                    <span>{roundUp(info?.original_metrics?.flesch_kincaid_grade, 2)}</span>
                                </p>
                                <p className="flex flex-col text-sm">
                                    <span className="pr-1 font-bold">Gunning fog index:</span>
                                    <span>{roundUp(info?.original_metrics?.gunning_fog_index, 2)}</span>
                                </p>
                                <p className="flex flex-col text-sm">
                                    <span className="pr-1 font-bold">Word count:</span>
                                    <span>{roundUp(info?.original_metrics?.word_count, 2)}</span>
                                </p>
                                <p className="flex flex-col text-sm">
                                    <span className="pr-1 font-bold">Avg. sentence length:</span>
                                    <span>{roundUp(info?.original_metrics?.avg_sentence_length, 2)}</span>
                                </p>
                            </div>

                            <div className="flex flex-col p-1 space-y-2.5">
                                <p className="w-full font-bold">Simplified report</p>
                                <p className="flex flex-col  text-sm">
                                    <span className="pr-1 font-bold">Flesch kincaid grade:</span>
                                    <span>{roundUp(info?.simplified_metrics?.flesch_kincaid_grade, 2)}</span>
                                </p>
                                <p className="flex flex-col text-sm">
                                    <span className="pr-1 font-bold">Gunning fog index:</span>
                                    <span>{roundUp(info?.simplified_metrics?.gunning_fog_index, 2)}</span>
                                </p>
                                <p className="flex flex-col text-sm">
                                    <span className="pr-1 font-bold">Word count:</span>
                                    <span>{roundUp(info?.simplified_metrics?.word_count, 2)}</span>
                                </p>
                                <p className="flex flex-col text-sm">
                                    <span className="pr-1 font-bold">Avg. sentence length:</span>
                                    <span>{roundUp(info?.simplified_metrics?.avg_sentence_length, 2)}</span>
                                </p>
                            </div>
                        </div>

                        <div className="flex my-6 border-t border-t-neutral-400">
                             <p className="pr-1 w-full font-bold">Similarity score:</p>
                            <span className="text-sm font-bold">{roundUp(info?.cosine_similarity, 2)}</span>
                        </div>
                    </div>
                </div>

                <div className="w-full flex flex-col py-6 space-y-6">
                     <div className="flex space-x-2">
                        <p className="font-bold">Label: </p>
                    <span>{info?.label}</span>
                    </div>
                    <div className="flex flex-col space-y-2">
                        <p className="font-bold">Simplified report: </p>
                    <span>{info?.simplified_text}</span>
                    </div>

                    <div className="flex flex-col space-y-2 text-white/30">
                        <p className="font-bold">Original report: </p>
                        <span>{info?.original_text}</span>
                    </div>
                </div>
                <div className="bg-white/20 h-1 rounded-full my-6"></div>
            </div>
        ))
         : (
            <div>
                <p>Sorry, we couldn't find similar studies to your query. Please try another query.</p>
            </div>
        )}
    </div> );
}
 
export default ResultContent;