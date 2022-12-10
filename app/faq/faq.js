"use client";

function Question({ question, answer }) {
  return (
    <div className="mt-10 mb-2 w-full">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-2xl">{question}</h3>
      </div>
      <div>{answer}</div>
    </div>
  );
}

export default function FAQ() {
  const faqs = [
    {
      question: "What are the official links?",
      answer: (
        <>
          <p className="mt-2">
            Please be aware there are bound to be a lot of scams and fake websites / twitter
            accounts trying to steal your ApeCoin and/or NFTs. If you're unsure you should only use
            official links.
          </p>
          <p className="mt-2">
            The official link to ApeCoin is{" "}
            <a className="underline" href="https://apecoin.com/">
              https://apecoin.com
            </a>
          </p>

          <p className="mt-2">
            The official link to the staking website is{" "}
            <a className="underline" href="https://apestake.io/">
              https://apestake.io
            </a>
          </p>
          <p className="mt-2">
            The official link to the staking contract documentation is{" "}
            <a className="underline" href="https://docs.apestake.io/">
              https://docs.apestake.io
            </a>
          </p>
          <p className="mt-2">
            The official twitter account for ApeCoin is{" "}
            <a className="underline" href="https://twitter.com/apecoin">
              @apecoin
            </a>
          </p>
          <p className="mt-2">
            The official twitter account for HorizenLabs is{" "}
            <a className="underline" href="https://twitter.com/HorizenLabs">
              @HorizenLabs
            </a>
          </p>
        </>
      ),
    },
    {
      question: "When do staking rewards start?",
      answer: "December 12th, 2022",
    },
    {
      question: "Can I unstake or withdraw anytime?",
      answer: "Yes, there is no locking period for withdrawing staked apecoin or claiming rewards.",
    },
    {
      question: "When I stake do my NFTs leave my wallet?",
      answer: (
        <>
          <p className="mt-2">
            No, only the ApeCoin gets deposited into the contract. Your NFTs act as "keys" to
            withdraw or claim any apecoin rewards, if you don't hold the NFT you can't get the
            ApeCoin out of the contract, but the new owner can.
          </p>
        </>
      ),
    },
    {
      question: "If I stake into an NFT pool (BAYC, MAYC, BAKC) can I sell my NFT?",
      answer:
        "You should first withdraw all apecoin paired with the NFT or you will lose access to it.",
    },
    {
      question: "Is this site safe?",
      answer: (
        <>
          I hope so, I've tried my best to ensure that all information is accurate and interactions
          with the apecoin and staking contracts are correct. All the{" "}
          <a className="underline" href="https://github.com/apecollector/apecoinui">
            source code is open-source and available on GitHub
          </a>
          . That being said there are still risks involved, and I assume no liability or provide any
          warranty.
        </>
      ),
    },
    {
      question: "Where is the Indian Food Capital of the UK?",
      answer: (
        <a href="https://discord.com/channels/831287358355275877/831287365988384881/1050400581195407451">
          Birmingham (according to Confusedhawk on Discord)
        </a>
      ),
    },
  ];

  return (
    <>
      <div className="flex flex-col justify-center mt-10">
        <h1 className="text-4xl font-bold mb-4">Common Questions</h1>
        {/* <p className="mb-8">A place to find clarity in a world of uncertainty</p> */}
      </div>
      <div className="flex flex-col">
        {faqs.map((faq, i) => (
          <Question key={i} question={faq.question} answer={faq.answer} />
        ))}
      </div>
    </>
  );
}
