export function StatsSection() {
  return (
    <section className="bg-gradient-to-r from-cyan-600 to-blue-600 py-16 text-white">
      <div className="container px-4 md:px-6">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="text-center">
            <div className="mb-2 text-4xl font-bold">10K+</div>
            <div className="text-cyan-100">Surveys Created</div>
          </div>
          <div className="text-center">
            <div className="mb-2 text-4xl font-bold">50K+</div>
            <div className="text-cyan-100">Responses Collected</div>
          </div>
          <div className="text-center">
            <div className="mb-2 text-4xl font-bold">2K+</div>
            <div className="text-cyan-100">Happy Creators</div>
          </div>
          <div className="text-center">
            <div className="mb-2 text-4xl font-bold">99%</div>
            <div className="text-cyan-100">Satisfaction Rate</div>
          </div>
        </div>
      </div>
    </section>
  )
}
