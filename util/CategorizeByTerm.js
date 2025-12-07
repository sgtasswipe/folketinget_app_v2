// util/categorizeByTerm.js
import { TERMS } from "./ParliamentTerms";

export function categorizeByTerm(votes) {
  const sectioned = TERMS.map((term) => {
    const startDate = new Date(term.start);
    const endDate = term.end ? new Date(term.end) : new Date();

    const termVotes = votes.filter((vote) => {
      const voteDate = new Date(vote.dato);
      if (isNaN(voteDate)) {
        console.warn("Invalid vote date:", vote.ato);
        return false;
      }
      const isInTerm = voteDate >= startDate && voteDate < endDate;
      if (!isInTerm) {
        console.log(
          `Vote ${vote.id} with date ${vote.dato} not in term ${term.name}`
        );
      }
      return isInTerm;
    });

    console.log(`Term: ${term.name}, votes found: ${termVotes.length}`);

    return {
      title: term.name,
      governmentParties: term.governmentParties || [],
      data: termVotes,
    };
  });

  return sectioned;
}
