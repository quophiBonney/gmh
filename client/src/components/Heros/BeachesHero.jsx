const BeachesHero = ({ headline, description }) => {
  return (
    <div className="py-28 text-center bg-green-600 p-5">
      <div className="mt-10 mb-10 text-white">
        <h1 className="text-5xl font-bold mb-4 capitalize">{headline}</h1>
        <p className="text-xl capitalize">{description}</p>
      </div>
    </div>
  );
};

export default BeachesHero;
