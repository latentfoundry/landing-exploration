export type InsightInline = {
  text: string;
  href?: string;
  emphasis?: boolean;
};

export type InsightParagraph = string | InsightInline[];
export type InsightBodyBlock = InsightParagraph | { heading: string };

export type Insight = {
  slug: string;
  type: string;
  title: string;
  titleEmphasis?: boolean;
  excerpt: string;
  standfirst: string;
  author: string;
  authorRole: string;
  published: string;
  publishedIso: string;
  readTime: string;
  body: InsightBodyBlock[];
};

export const insights: Insight[] = [
  {
    slug: "ai-changes-more-than-the-task",
    type: "Working note",
    title: "AI changes more than the task",
    titleEmphasis: true,
    excerpt:
      "Why AI changes queues, ownership and operating constraints around a task—and why simulations must be checked against observed outcomes.",
    standfirst:
      "AI changes more than a task. It changes the queues, ownership and operating constraints around it—which is why every simulation must be checked against what actually happens.",
    author: "Mika Siddiqui",
    authorRole: "Co-Founder",
    published: "August 31, 2026",
    publishedIso: "2026-08-31",
    readTime: "6 min",
    body: [
      { heading: "The task changes the operating system around it" },
      "Most AI pilots start with a conversation about the model.",
      "How accurate is it? How fast? What do the evals look like? What does each call cost?",
      "Those are sensible questions. But once the thing goes into production, a different set of problems starts showing up.",
      "A support agent that resolves more tickets changes queue volumes, escalation rates, review load and staffing. A recruiting agent changes recruiter workload and interview capacity. An internal copilot can change who owns a piece of work, which systems people spend time in, and where work starts piling up.",
      "The task changes, but so does everything around the task.",
      [
        {
          text: "Stanford's Digital Economy Lab",
          href: "https://digitaleconomy.stanford.edu/app/uploads/2026/03/EnterpriseAIPlaybook_PereiraGraylinBrynjolfsson.pdf",
        },
        {
          text: " recently studied 51 enterprise AI implementations. They found that 77% of the hardest challenges involved things like change management, data quality and process redesign. Technology was consistently described as the easier part. Of the successful projects they studied, 61% had been preceded by a failed AI project.",
        },
      ],
      "Economists have been describing versions of this problem for a long time.",
      [
        { text: "Brynjolfsson, Rock and Syverson's " },
        {
          text: "Productivity J-Curve",
          href: "https://www.aeaweb.org/articles?id=10.1257%2Fmac.20180386",
          emphasis: true,
        },
        {
          text: " argues that general-purpose technologies create value together with investments in new processes, skills and ways of organising work. You can have the technology and still not have the productivity gains. The organisation has to catch up.",
        },
      ],
      "AI seems to make that catch-up period much more compressed.",
      { heading: "Model only the part that is about to change" },
      "That's changed the way we think about simulation at Afterflow.",
      "We don't need a perfect digital replica of a company.",
      "We need a useful model of the part that's about to change.",
      "That might be a few teams, some processes and systems, a couple of queues, the policies governing them and the business metrics people care about.",
      "Then we can introduce the change.",
      "Take a support agent that handles 40% of incoming requests.",
      "Forty percent disappearing from one queue doesn't mean 40% of the work disappears.",
      "Some requests may become reviews. Others may become escalations.",
      "That work has to go somewhere.",
      "So where does it go?",
      "What happens when volume rises?",
      "Does a team that had spare capacity suddenly become the bottleneck?",
      "Does the constraint turn out to be people, policy or another system entirely?",
      { heading: "Choose the method for the decision" },
      "Those questions don't all need the same kind of model.",
      "We use language models to interpret messy enterprise context and help work out what is worth testing.",
      "If the problem is about queues and capacity, discrete-event simulation may make sense.",
      "If the inputs are uncertain, we can propagate that uncertainty through Monte Carlo analysis.",
      "Policies can be modelled as explicit constraints.",
      "Where enough historical evidence exists, statistical models can use it.",
      "The point is to choose the method based on the decision, rather than squeeze every decision into the same simulation framework.",
      { heading: "A plausible simulation can still be wrong" },
      "There's also a useful warning in recent research on simulated human behaviour.",
      [
        { text: "An " },
        {
          text: "ACL 2026 study",
          href: "https://aclanthology.org/2026.acl-long.2034/",
        },
        {
          text: " compared LLM agents with 230,965 real shopping actions.",
        },
      ],
      "Prompted models could generate behaviour that seemed reasonable, but they achieved only 11.86% accuracy at predicting what people actually did next.",
      "Training on observed behaviour improved the result.",
      "That distinction matters to us.",
      "A simulation can sound convincing and still be wrong.",
      { heading: "Turn forecast error into evidence" },
      "For decisions with real operational consequences, we want to be able to check.",
      "Before a rollout, Afterflow records what the model expects to happen.",
      "Where will the work move?",
      "Which constraint should appear first?",
      "What range of outcomes do we expect?",
      "What would make us expand the rollout, hold it where it is, or change course?",
      "Then the rollout happens.",
      "We compare what we expected with what actually happened.",
      "Usually, the interesting part is the difference.",
      "Maybe a queue filled faster than expected.",
      "Maybe people handled exceptions differently from the way the process was documented.",
      "Maybe a constraint we thought mattered barely mattered at all.",
      "That difference becomes evidence for the next decision.",
      "The first rollout teaches you something about the organisation.",
      "The second decision gets to use it.",
      "Then the next one has both.",
      "Over time, you start building a record that most companies don't really have today: the changes they made, what they expected each change to do, what actually happened, and what they learned when the two didn't match.",
      "That's the idea behind Afterflow.",
      "Test an operational change before committing to it. Then use what actually happens to make the next decision better.",
    ],
  },
];

export function getInsight(slug: string) {
  return insights.find((insight) => insight.slug === slug);
}
