import { z } from 'zod';

const featureIdSchema = z.enum(['talent', 'campaigns', 'insights', 'optimization']);
const planFeatureIdSchema = z.enum([
	'threeCampaigns',
	'basicReporting',
	'oneSeat',
	'unlimitedCampaigns',
	'advancedReporting',
	'teamCollaboration',
	'multipleWorkspaces',
	'customPermissions',
	'dedicatedSupport'
]);

export const homepageSchema = z.object({
	features: z.array(featureIdSchema),
	pricing: z.object({
		currency: z.literal('EUR'),
		plans: z.array(
			z.object({
				id: z.enum(['starter', 'growth', 'enterprise']),
				monthlyPrice: z.number().positive().nullable(),
				highlighted: z.boolean(),
				features: z.array(planFeatureIdSchema)
			})
		)
	}),
	socialProof: z.object({
		stats: z.array(
			z.object({
				id: z.enum(['campaigns', 'partnerships', 'timeSaved']),
				value: z.number().nonnegative()
			})
		),
		testimonial: z.object({
			id: z.literal('northstar'),
			rating: z.number().int().min(1).max(5)
		})
	})
});

export type HomepageContent = z.infer<typeof homepageSchema>;
