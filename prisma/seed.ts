import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Clean existing data
  await prisma.cardMember.deleteMany();
  await prisma.boardMember.deleteMany();
  await prisma.checklistItem.deleteMany();
  await prisma.checklist.deleteMany();
  await prisma.cardLabel.deleteMany();
  await prisma.card.deleteMany();
  await prisma.list.deleteMany();
  await prisma.label.deleteMany();
  await prisma.member.deleteMany();
  await prisma.board.deleteMany();

  // Create members
  const alice = await prisma.member.create({
    data: {
      name: "Alice Johnson",
      email: "alice@example.com",
      avatarColor: "#4c9aff",
      initials: "AJ",
    },
  });

  const bob = await prisma.member.create({
    data: {
      name: "Bob Smith",
      email: "bob@example.com",
      avatarColor: "#ff7452",
      initials: "BS",
    },
  });

  const carol = await prisma.member.create({
    data: {
      name: "Carol White",
      email: "carol@example.com",
      avatarColor: "#57d9a3",
      initials: "CW",
    },
  });

  // Create board
  const board = await prisma.board.create({
    data: {
      title: "Product Roadmap",
      description: "Main product development board",
      background: "#1d6fa4",
    },
  });

  // Add board members
  await prisma.boardMember.createMany({
    data: [
      { boardId: board.id, memberId: alice.id, role: "admin" },
      { boardId: board.id, memberId: bob.id, role: "member" },
      { boardId: board.id, memberId: carol.id, role: "member" },
    ],
  });

  // Create labels
  const labels = await Promise.all([
    prisma.label.create({ data: { name: "Bug", color: "#ff5630", boardId: board.id } }),
    prisma.label.create({ data: { name: "Feature", color: "#36b37e", boardId: board.id } }),
    prisma.label.create({ data: { name: "Improvement", color: "#0065ff", boardId: board.id } }),
    prisma.label.create({ data: { name: "Design", color: "#ff991f", boardId: board.id } }),
    prisma.label.create({ data: { name: "Backend", color: "#6554c0", boardId: board.id } }),
    prisma.label.create({ data: { name: "Frontend", color: "#00b8d9", boardId: board.id } }),
  ]);

  // Create lists
  const backlogList = await prisma.list.create({
    data: { title: "Backlog", position: 1, boardId: board.id },
  });

  const todoList = await prisma.list.create({
    data: { title: "To Do", position: 2, boardId: board.id },
  });

  const inProgressList = await prisma.list.create({
    data: { title: "In Progress", position: 3, boardId: board.id },
  });

  const reviewList = await prisma.list.create({
    data: { title: "Review", position: 4, boardId: board.id },
  });

  const doneList = await prisma.list.create({
    data: { title: "Done", position: 5, boardId: board.id },
  });

  // Create cards for Backlog
  const card1 = await prisma.card.create({
    data: {
      title: "Research competitor products",
      description: "Analyze top 5 competitors and document findings",
      position: 1,
      listId: backlogList.id,
    },
  });
  await prisma.cardLabel.create({ data: { cardId: card1.id, labelId: labels[1].id } });

  const card2 = await prisma.card.create({
    data: {
      title: "Define MVP feature set",
      description: "Work with stakeholders to finalize MVP scope",
      position: 2,
      listId: backlogList.id,
    },
  });
  await prisma.cardLabel.create({ data: { cardId: card2.id, labelId: labels[1].id } });
  await prisma.cardLabel.create({ data: { cardId: card2.id, labelId: labels[3].id } });

  // Create cards for To Do
  const card3 = await prisma.card.create({
    data: {
      title: "Design system setup",
      description: "Set up Figma design system with tokens, components, and guidelines",
      position: 1,
      listId: todoList.id,
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  });
  await prisma.cardLabel.create({ data: { cardId: card3.id, labelId: labels[3].id } });
  await prisma.cardLabel.create({ data: { cardId: card3.id, labelId: labels[5].id } });
  await prisma.cardMember.create({ data: { cardId: card3.id, memberId: carol.id } });

  const checklist1 = await prisma.checklist.create({
    data: { title: "Design Tasks", cardId: card3.id },
  });
  await prisma.checklistItem.createMany({
    data: [
      { content: "Create color palette", completed: true, checklistId: checklist1.id },
      { content: "Define typography scale", completed: true, checklistId: checklist1.id },
      { content: "Build component library", completed: false, checklistId: checklist1.id },
      { content: "Document usage guidelines", completed: false, checklistId: checklist1.id },
    ],
  });

  const card4 = await prisma.card.create({
    data: {
      title: "API authentication flow",
      description: "Implement JWT-based auth with refresh tokens",
      position: 2,
      listId: todoList.id,
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    },
  });
  await prisma.cardLabel.create({ data: { cardId: card4.id, labelId: labels[4].id } });
  await prisma.cardMember.create({ data: { cardId: card4.id, memberId: bob.id } });

  // Create cards for In Progress
  const card5 = await prisma.card.create({
    data: {
      title: "Dashboard UI implementation",
      description: "Build the main dashboard with charts and stats widgets",
      position: 1,
      listId: inProgressList.id,
      dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    },
  });
  await prisma.cardLabel.create({ data: { cardId: card5.id, labelId: labels[5].id } });
  await prisma.cardLabel.create({ data: { cardId: card5.id, labelId: labels[1].id } });
  await prisma.cardMember.create({ data: { cardId: card5.id, memberId: alice.id } });

  const checklist2 = await prisma.checklist.create({
    data: { title: "UI Components", cardId: card5.id },
  });
  await prisma.checklistItem.createMany({
    data: [
      { content: "Sidebar navigation", completed: true, checklistId: checklist2.id },
      { content: "Header bar", completed: true, checklistId: checklist2.id },
      { content: "Stats cards", completed: false, checklistId: checklist2.id },
      { content: "Charts integration", completed: false, checklistId: checklist2.id },
      { content: "Responsive layout", completed: false, checklistId: checklist2.id },
    ],
  });

  const card6 = await prisma.card.create({
    data: {
      title: "Fix login page redirect bug",
      description: "Users are not being redirected after successful login",
      position: 2,
      listId: inProgressList.id,
    },
  });
  await prisma.cardLabel.create({ data: { cardId: card6.id, labelId: labels[0].id } });
  await prisma.cardMember.create({ data: { cardId: card6.id, memberId: bob.id } });

  // Create cards for Review
  const card7 = await prisma.card.create({
    data: {
      title: "User onboarding flow",
      description: "Complete 3-step onboarding wizard for new users",
      position: 1,
      listId: reviewList.id,
    },
  });
  await prisma.cardLabel.create({ data: { cardId: card7.id, labelId: labels[1].id } });
  await prisma.cardLabel.create({ data: { cardId: card7.id, labelId: labels[5].id } });
  await prisma.cardMember.create({ data: { cardId: card7.id, memberId: carol.id } });

  // Create cards for Done
  const card8 = await prisma.card.create({
    data: {
      title: "Set up CI/CD pipeline",
      description: "GitHub Actions with automated testing and deployment",
      position: 1,
      listId: doneList.id,
    },
  });
  await prisma.cardLabel.create({ data: { cardId: card8.id, labelId: labels[4].id } });
  await prisma.cardMember.create({ data: { cardId: card8.id, memberId: alice.id } });

  const card9 = await prisma.card.create({
    data: {
      title: "Database schema design",
      description: "Finalized entity-relationship diagram and Prisma schema",
      position: 2,
      listId: doneList.id,
    },
  });
  await prisma.cardLabel.create({ data: { cardId: card9.id, labelId: labels[4].id } });

  console.log("✅ Seeding complete!");
  console.log(`Board: ${board.title}`);
  console.log(`Members: Alice, Bob, Carol`);
  console.log(`Lists: 5 | Cards: 9 | Labels: 6`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
