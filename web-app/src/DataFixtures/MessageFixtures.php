<?php

namespace App\DataFixtures;

use App\Entity\Message;
use App\Entity\User;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use Doctrine\Persistence\ObjectManager;

class MessageFixtures extends Fixture implements DependentFixtureInterface
{
    /**
     * @inheritDoc
     * @throws \Exception
     */
    public function load(ObjectManager $manager): void
    {
        $t = 'Hello there!';
        for ($i = 0; $i < 10; $i++) {
            /** @var User $user */
            $user = $this->getReference(constant(sprintf('%s::USER_%d', UserFixtures::class, mt_rand(1, 3))));
            $m = new Message();
            $m->setMessage(str_pad($t, mt_rand(strlen($t), strlen($t) * 2), ' Some here'));
            $m->setUser($user);
            $m->setCreatedAt(new \DateTimeImmutable(sprintf('-%d hour', mt_rand(1, 36))));

            $manager->persist($m);
        }

        $manager->flush();
    }

    /**
     * @inheritDoc
     */
    public function getDependencies(): array
    {
        return [
            UserFixtures::class,
        ];
    }
}