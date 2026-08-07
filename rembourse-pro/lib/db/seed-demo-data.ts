import { db, sqliteClient, pool } from './index'
import { user, expenses, appointments, advanceRequests } from './schema'
import { eq } from 'drizzle-orm'
import { DEMO_TECHNICIAN, DEMO_INTERVENTIONS } from '../demo-data'

export async function seedDemoDataIfEmpty() {
  try {
    if (sqliteClient) {
      try {
        sqliteClient.exec(`
          ALTER TABLE appointments ADD COLUMN reference text;
          ALTER TABLE appointments ADD COLUMN type text;
          ALTER TABLE appointments ADD COLUMN technicianName text;
          ALTER TABLE appointments ADD COLUMN result text;
        `)
      } catch (e) {
        // columns exist
      }
    } else if (pool) {
      try {
        await pool.query(`
          ALTER TABLE appointments ADD COLUMN IF NOT EXISTS reference text;
          ALTER TABLE appointments ADD COLUMN IF NOT EXISTS type text;
          ALTER TABLE appointments ADD COLUMN IF NOT EXISTS technicianName text;
          ALTER TABLE appointments ADD COLUMN IF NOT EXISTS result text;
        `)
      } catch (e) {
        // ignore
      }
    }

    const existingAppointments = await db.select().from(appointments)
    if (existingAppointments.length < 5) {
      const techUsers = await db.select().from(user).where(eq(user.role, 'technician'))
      let targetUserId = techUsers[0]?.id

      if (!targetUserId) {
        targetUserId = 'tech-demo-mohamed'
        await db.insert(user).values({
          id: targetUserId,
          email: DEMO_TECHNICIAN.email,
          emailVerified: true,
          name: DEMO_TECHNICIAN.name,
          role: 'technician',
          createdAt: new Date(),
          updatedAt: new Date(),
        }).onConflictDoNothing()
      }

      for (const item of DEMO_INTERVENTIONS) {
        await db.insert(appointments).values({
          userId: targetUserId,
          reference: item.reference,
          type: item.type,
          technicianName: item.technicianName,
          title: `${item.type} - Ref #${item.reference}`,
          date: item.date,
          startTime: item.startTime,
          endTime: item.endTime,
          location: item.location,
          description: item.description,
          status: item.status === 'Terminé' ? 'completed' : item.status === 'NOK' ? 'nok' : item.status === 'En cours' ? 'in_progress' : 'scheduled',
          result: item.result,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
      }

      const existingExpenses = await db.select().from(expenses)
      if (existingExpenses.length < 3) {
        const demoExpenses = [
          { amount: '68.50', category: 'Déplacement', description: 'Essence & Péage intervention Ref #23517560 Paris', status: 'approved' },
          { amount: '45.00', category: 'Repas', description: 'Déjeuner équipe raccordement sur site', status: 'approved' },
          { amount: '129.90', category: 'Outils', description: 'Achat pinces à dénuder & pigtails fibre', status: 'pending' },
          { amount: '85.00', category: 'Équipement', description: 'Casque chantier de protection avec visière', status: 'pending' },
        ]
        for (const exp of demoExpenses) {
          await db.insert(expenses).values({
            userId: targetUserId,
            amount: exp.amount,
            category: exp.category,
            description: exp.description,
            status: exp.status,
            createdAt: new Date(),
            updatedAt: new Date(),
          })
        }
      }

      const existingAdvances = await db.select().from(advanceRequests)
      if (existingAdvances.length === 0) {
        await db.insert(advanceRequests).values({
          userId: targetUserId,
          amount: '350.00',
          status: 'pending',
          reason: 'Acompte déplacement grand déplacement semaine du 10/08 (Outre-mer / Lyon)',
          requestedAt: new Date(),
        })
      }
    }
  } catch (err) {
    console.error('Seed demo data error:', err)
  }
}
